const sysMenuService = require('./sysMenuService');
// Constants from Java code
const TYPE_DIR = 'M';
const TYPE_MENU = 'C';
const NO_FRAME = 1;
const LAYOUT = 'Layout';
const PARENT_VIEW = 'ParentView';
const INNER_LINK = 'InnerLink';

/**
 * 构建前端路由所需要的菜单
 * @param {Array} menus 菜单列表
 * @returns {Array} 路由列表
 */
const buildMenus = (menus) => {
  const routers = [];
  
  menus.forEach(menu => {
    const router = {
      hidden: menu.visible === '1',
      name: getRouteName(menu),
      path: getRouterPath(menu),
      component: getComponent(menu),
      query: menu.query,
      meta: new MetaVo(menu.menuName, menu.icon, menu.isCache === 0, null)
    };

    // 有子菜单且是目录类型
    if (menu.children?.length > 0 && menu.menuType === TYPE_DIR) {
      router.alwaysShow = true;
      router.redirect = 'noRedirect';
      router.children = buildMenus(menu.children);
    } 
    // 菜单内部跳转
    else if (isMenuFrame(menu)) {
      router.meta = null;
      const childrenList = [];
      const children = {
        path: menu.path,
        component: menu.component,
        name: getRouteName(menu.routeName, menu.path),
        meta: new MetaVo(menu.menuName, menu.icon, menu.isCache === 0, menu.path),
        query: menu.query
      };
      childrenList.push(children);
      router.children = childrenList;
    }
    // 内链打开外网
    else if (parseInt(menu.parentId) === 0 && isInnerLink(menu)) {
      router.meta = new MetaVo(menu.menuName, menu.icon);
      router.path = '/';
      const childrenList = [];
      const children = {
        path: innerLinkReplaceEach(menu.path),
        component: INNER_LINK,
        name: getRouteName(menu.routeName, innerLinkReplaceEach(menu.path)),
        meta: new MetaVo(menu.menuName, menu.icon, menu.path)
      };
      childrenList.push(children);
      router.children = childrenList;
    }

    routers.push(router);
  });

  return routers;
};

/**
 * 获取路由名称
 * @param {Object} menu 菜单信息
 * @returns {string} 路由名称
 */
const getRouteName = (menu) => {
  // 非外链并且是一级目录（类型为目录）
  if (isMenuFrame(menu)) {
    return '';
  }
  return getRouteNameValue(menu.routeName, menu.path);
};

/**
 * 获取路由名称
 * @param {string} routerName 路由名称
 * @param {string} routerPath 路由地址
 * @returns {string} 路由名称
 */
const getRouteNameValue = (name, path) => {
  const routerName = name || path;
  return capitalize(routerName);
};

/**
 * 获取路由地址
 * @param {Object} menu 菜单信息
 * @returns {string} 路由地址
 */
const getRouterPath = (menu) => {
  let routerPath = menu.path;
  // 内链打开外网方式
  if (parseInt(menu.parentId) !== 0 && isInnerLink(menu)) {
    routerPath = innerLinkReplaceEach(routerPath);
  }
  // 非外链并且是一级目录（类型为目录）
  if (parseInt(menu.parentId) === 0 && menu.menuType === TYPE_DIR && menu.isFrame === NO_FRAME) {
    routerPath = `/${menu.path}`;
  }
  // 非外链并且是一级目录（类型为菜单）
  else if (isMenuFrame(menu)) {
    routerPath = '/';
  }
  return routerPath;
};

const getComponent = (menu) => {
  let component = LAYOUT;
  if (menu.component && !isMenuFrame(menu)) {
    component = menu.component;
  } else if (!menu.component && parseInt(menu.parentId) !== 0 && isInnerLink(menu)) {
    component = INNER_LINK;
  } else if (!menu.component && isParentView(menu)) {
    component = PARENT_VIEW;
  }
  return component;
};

const isMenuFrame = (menu) => {
  return parseInt(menu.parentId) === 0 && menu.menuType === TYPE_MENU && menu.isFrame === NO_FRAME;
};


const isInnerLink = (menu) => {
  return menu.isFrame === NO_FRAME && isHttp(menu.path);
};


const isParentView = (menu) => {
  return parseInt(menu.parentId) !== 0 && menu.menuType === TYPE_DIR;
};

const innerLinkReplaceEach = (path) => {
  return path.replace(/(http:\/\/|https:\/\/|www\.|\.|\:)/g, '');
};


const isHttp = (path) => {
  return path.startsWith('http://') || path.startsWith('https://');
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class MetaVo {
  constructor(title, icon, noCache, link) {
    this.title = title;
    this.icon = icon;
    if (noCache !== undefined) {
      this.noCache = noCache;
    }
    if (link !== undefined) {
      this.link = link;
    }
  }
}

module.exports = {
  buildMenus,
  getRouters: async (userId) => {
    const muneList = await sysMenuService.getTreeData(userId);
    return buildMenus(muneList);
  }
};