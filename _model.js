const excel = require('xlsx');
const fs = require('fs');
const path = require('path');
const EXCEL_PATH = path.join(__dirname, 'absent_records.xlsx');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Initialize codes.
AutoLoadPlugins();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//You can load the plugins in global field, if the next line codes are uncommented.
//AutoLoadGlobalPlugins();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Sample codes.
exports.Test = function() {
        console.log("Hi, I'm a model test funciton");
};

// 初始化 Excel 文件（完全重写）
function initExcel() {
        if (!fs.existsSync(EXCEL_PATH)) {
                const workbook = excel.utils.book_new();
                const headers = {
                        A1: { t: 's', v: '日期' },
                        B1: { t: 's', v: '未到人员' },
                        C1: { t: 's', v: '班级' }
                };
                const ws = excel.utils.json_to_sheet([], { header: ['日期', '未到人员', '班级'] });
                Object.assign(ws, headers); // 手动添加表头
                excel.utils.book_append_sheet(workbook, ws, "Records");
                excel.writeFileSync(workbook, EXCEL_PATH);
        }
}

// 记录未到人员（最终稳定版）
exports.recordAbsentees = function(absentees, className) {
        try {
                initExcel();
        
                // 读取现有工作簿
                const workbook = excel.readFile(EXCEL_PATH);
        
                // 获取现有数据
                const ws = workbook.Sheets.Records;
                let records = excel.utils.sheet_to_json(ws, { header: ['日期', '未到人员', '班级'] });
        
                // 添加新记录
                records.push({
                        '日期': new Date().toLocaleDateString('zh-CN'),
                        '未到人员': absentees.join(", "),
                        '班级': className
                });
        
                // 创建新工作表替换旧表
                const newWs = excel.utils.json_to_sheet(records, { header: ['日期', '未到人员', '班级'] });
        
                // 替换工作表（关键修改）
                workbook.Sheets.Records = newWs;
        
                excel.writeFileSync(workbook, EXCEL_PATH);
                return true;
        } catch (e) {
                console.error("记录失败:", e);
                return false;
        }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Put you codes here

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AutoLoadPlugins Function Implement Start.

function AutoLoadPlugins() {
        var plugin_dir = (__dirname + '/../addon/');
        if (!fs.existsSync(plugin_dir)) {
                return;
        }

        var files = fs.readdirSync(plugin_dir);
        files.forEach(function(filename) {
                var filedir = path.join(plugin_dir, filename);
                var stats = fs.statSync(filedir);
                if (!stats.isDirectory()) {
                        if (filedir.indexOf('-linux.node') !== -1 && require('os').platform() === 'linux') {
                                require(filedir);
                        }

                        if (filedir.indexOf('-win.node') !== -1 && require('os').platform() === 'win32') {
                                require(filedir);
                        }
                }
        });
}

function AutoLoadGlobalPlugins() {
        var plugin_dir = (process.env.COMX_SDK + 'addon/');
        if (!fs.existsSync(plugin_dir)) {
                return;
        }

        var files = fs.readdirSync(plugin_dir);
        files.forEach(function(filename) {
                var filedir = path.join(plugin_dir, filename);
                var stats = fs.statSync(filedir);
                if (!stats.isDirectory()) {
                        if (filedir.indexOf('-linux.node') !== -1 && require('os').platform() === 'linux') {
                                require(filedir);
                        }

                        if (filedir.indexOf('-win.node') !== -1 && require('os').platform() === 'win32') {
                                require(filedir);
                        }
                }
        });
}

//AutoLoadPlugins Function Implement End.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ide_info Function Implement Start.

exports.ide_info = (msg) => {
        if (process.send) {
                process.send({
                        type: 'debug',
                        info: msg
                });
        }
};

//ide_info Function Implement End.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
