const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const getServerInfo = async () => {
  const cpu = await getCPUInfo()
  const mem = await getMem()
  const sys = await getSys()
  const node = await getNode()
  const sysFiles = await getSysFiles()
  const nodeEnv = await getNodeEnv()

  return {
    cpu,
    mem,
    sys,
    node,
    sysFiles,
    nodeEnv
  }
};

const getNodeEnv = async () => {
  // 格式化日期的辅助函数
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 计算服务启动的时间点
  const now = Date.now();
  const uptime = process.uptime() * 1000;
  const startTimeStamp = now - uptime;
  const startTime = new Date(startTimeStamp);

  // 获取Node环境信息
  const nodeEnv = {
    name: 'Node.js',    // Node.js名称
    version: process.version,     // Node.js版本
    startTime: formatDate(startTime),     // 服务启动时间
    runTime: process.uptime(),    // 服务运行时长（秒）
    home: process.execPath,    // Node.js安装路径
  }

  // 格式化运行时间，如果需要显示更友好的格式
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return {
      days,
      hours,
      minutes,
      seconds: remainingSeconds
    };
  };

  // 添加格式化的运行时间
  const formattedRunTime = formatUptime(nodeEnv.runTime);
  nodeEnv.runTime = `${formattedRunTime.days}天 ${formattedRunTime.hours}小时 ${formattedRunTime.minutes}分钟 ${formattedRunTime.seconds}秒`;

  return nodeEnv;
};

const getSysFiles = async () => {
  const sysFiles = [];
  const platform = os.platform();

  try {
    if (platform === 'win32') {
      // Windows 系统
      const { stdout } = await execPromise('wmic logicaldisk get caption,freespace,size,filesystem /value');
      
      // 解析 WMIC 输出
      const disks = stdout.split('\r\r\n\r\r\n').filter(Boolean);
      
      for (const disk of disks) {
        const lines = disk.split('\r\r\n');
        const diskInfo = {};
        
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            diskInfo[key.trim()] = value.trim();
          }
        });

        if (diskInfo.Size) {  // 确保磁盘大小存在
          const size = parseInt(diskInfo.Size);
          const freeSpace = parseInt(diskInfo.FreeSpace || 0);
          const used = size - freeSpace;

          sysFiles.push({
            dirName: diskInfo.Caption || '',
            sysTypeName: diskInfo.FileSystem || 'Unknown',
            typeName: 'Local Fixed Disk',
            total: Number((size / (1024 * 1024 * 1024)).toFixed(2)),  // 转换为GB
            free: Number((freeSpace / (1024 * 1024 * 1024)).toFixed(2)),
            used: Number((used / (1024 * 1024 * 1024)).toFixed(2)),
            usage: Number(((used / size) * 100).toFixed(2))
          });
        }
      }
    } else {
      // Linux/MacOS 系统
      const { stdout } = await execPromise("df -kP | grep -v '^Filesystem'");
      
      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        const [device, blocks, used, available, capacity, mounted] = line.trim().split(/\s+/);
        
        // 只处理实际的磁盘设备
        if (device.startsWith('/dev/') && !mounted.startsWith('/boot')) {
          const total = parseInt(blocks) * 1024;  // df 输出的块大小是1024字节
          const usedSpace = parseInt(used) * 1024;
          const freeSpace = parseInt(available) * 1024;

          sysFiles.push({
            dirName: mounted,
            sysTypeName: await getFsType(device),
            typeName: 'Local Fixed Disk',
            total: Number((total / (1024 * 1024 * 1024)).toFixed(2)),  // 转换为GB
            free: Number((freeSpace / (1024 * 1024 * 1024)).toFixed(2)),
            used: Number((usedSpace / (1024 * 1024 * 1024)).toFixed(2)),
            usage: Number(capacity.replace('%', ''))
          });
        }
      }
    }

    return sysFiles;
    
  } catch (error) {
    console.error('获取系统文件信息失败:', error);
    // 返回空数组而不是抛出错误，保持程序继续运行
    return [];
  }
};

// 获取文件系统类型
const getFsType = async (device) => {
  try {
    if (os.platform() === 'darwin') {
      // MacOS
      const { stdout } = await execPromise(`diskutil info ${device} | grep 'File System'`);
      return stdout.split(':')[1].trim();
    } else {
      // Linux
      const { stdout } = await execPromise(`blkid ${device} -s TYPE -o value`);
      return stdout.trim() || 'Unknown';
    }
  } catch (error) {
    return 'Unknown';
  }
};

// 在Windows下获取驱动器类型的辅助函数
const getDriveType = async (drive) => {
  try {
    const { stdout } = await execPromise(`wmic logicaldisk where "Caption='${drive}'" get drivetype /value`);
    const typeNum = parseInt(stdout.split('=')[1]);
    switch (typeNum) {
      case 2: return 'Removable Disk';
      case 3: return 'Local Fixed Disk';
      case 4: return 'Network Drive';
      case 5: return 'Compact Disc';
      default: return 'Unknown';
    }
  } catch (error) {
    return 'Unknown';
  }
};

const getNode = async () => {
  // 获取Node环境内存信息
  const nodeInfo = {
    total: 0,    // 总内存
    used: 0,     // 已用内存
    free: 0,     // 剩余内存
    usage: 0,    // 内存使用率
  }

  try {
    // 获取进程内存使用情况
    const memoryUsage = process.memoryUsage();
    
    // heapTotal: V8引擎的内存总量
    // heapUsed: V8引擎已使用的内存
    // external: V8管理的绑定到Javascript的C++对象的内存使用量
    // rss: 进程占用的物理内存总量
    
    // 转换为MB并保留2位小数
    const heapTotal = Number((memoryUsage.heapTotal / (1024 * 1024)).toFixed(2));
    const heapUsed = Number((memoryUsage.heapUsed / (1024 * 1024)).toFixed(2));
    const external = Number((memoryUsage.external / (1024 * 1024)).toFixed(2));
    
    // 设置返回值
    nodeInfo.total = heapTotal;  // V8引擎总内存
    nodeInfo.used = heapUsed;    // V8引擎已用内存
    nodeInfo.free = Number((heapTotal - heapUsed).toFixed(2));  // V8引擎剩余内存
    nodeInfo.usage = Number(((heapUsed / heapTotal) * 100).toFixed(2));  // 使用率百分比
    
    return nodeInfo;
    
  } catch (error) {
    console.error('获取Node内存信息失败:', error);
    throw new Error('获取Node内存信息失败');
  }
}

const getSys = async () => {
  // 获取系统信息
  const sysInfo = {
    computerName: '',    // 服务器名称
    computerIp: '',     // 服务器IP
    osName: '',         // 操作系统
    osArch: '',         // 系统架构
    userDir: '',        // 当前Node服务文件所在文件目录
  }

  try {
    // 获取服务器名称
    sysInfo.computerName = os.hostname();

    // 获取服务器IP（获取第一个非内部IP地址）
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      for (const iface of interfaces) {
        // 跳过内部IP和非IPv4地址
        if (!iface.internal && iface.family === 'IPv4') {
          sysInfo.computerIp = iface.address;
          break;
        }
      }
      if (sysInfo.computerIp) break;
    }
    
    // 如果没有找到外部IP，使用本地IP
    if (!sysInfo.computerIp) {
      sysInfo.computerIp = '127.0.0.1';
    }

    // 获取操作系统名称和版本
    const platform = os.platform();
    const release = os.release();
    const type = os.type();
    
    // 格式化操作系统信息
    switch (platform) {
      case 'win32':
        sysInfo.osName = `Windows ${release}`;
        break;
      case 'darwin':
        sysInfo.osName = `MacOS ${release}`;
        break;
      case 'linux':
        sysInfo.osName = `Linux ${release}`;
        break;
      default:
        sysInfo.osName = `${type} ${release}`;
    }

    // 获取系统架构
    sysInfo.osArch = os.arch();

    // 获取当前工作目录
    sysInfo.userDir = process.cwd();

    return sysInfo;
    
  } catch (error) {
    console.error('获取系统信息失败:', error);
    throw new Error('获取系统信息失败');
  }
}

const getMem = async () => {
  // 获取内存信息
  const memInfo = {
    total: 0,    // 总内存
    used: 0,     // 已用内存
    free: 0,     // 剩余内存
    usage: 0,    // 内存使用率
  }

  try {
    // 获取系统总内存和空闲内存(单位为字节)
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    
    // 计算已使用内存
    const usedMem = totalMem - freeMem;
    
    // 转换为GB并保留2位小数
    memInfo.total = Number((totalMem / (1024 * 1024 * 1024)).toFixed(2));
    memInfo.free = Number((freeMem / (1024 * 1024 * 1024)).toFixed(2));
    memInfo.used = Number((usedMem / (1024 * 1024 * 1024)).toFixed(2));
    
    // 计算使用率并保留2位小数
    memInfo.usage = Number(((usedMem / totalMem) * 100).toFixed(2));

    return memInfo;
    
  } catch (error) {
    console.error('获取内存信息失败:', error);
    throw new Error('获取内存信息失败');
  }
}

const getCPUInfo = async () => {
  const cpuInfo = {
    cpuNum: 0,    // cpu核心数
    used: 0,      // 用户使用率
    sys: 0,       // 系统使用率
    free: 0,      // 空闲率
  }

  try {
    // 获取CPU核心数
    const cpus = os.cpus();
    cpuInfo.cpuNum = cpus.length;

    // 计算所有CPU核心的总时间和各类型时间
    let totalTime = 0;
    let totalUser = 0;
    let totalSys = 0;
    let totalIdle = 0;

    cpus.forEach(cpu => {
      // 计算每个核心的总时间
      const times = cpu.times;
      const coreTotal = times.user + times.nice + times.sys + times.idle + times.irq;
      
      // 累加所有核心的时间
      totalTime += coreTotal;
      totalUser += times.user;
      totalSys += times.sys;
      totalIdle += times.idle;
    });

    // 计算百分比并保留两位小数
    cpuInfo.used = Number(((totalUser / totalTime) * 100).toFixed(2));
    cpuInfo.sys = Number(((totalSys / totalTime) * 100).toFixed(2));
    cpuInfo.free = Number(((totalIdle / totalTime) * 100).toFixed(2));

    return cpuInfo;
    
  } catch (error) {
    console.error('获取CPU信息失败:', error);
    throw new Error('获取CPU信息失败');
  }
};


module.exports = { 
  getServerInfo,
  getCPUInfo
}