# rollName
基于 DCiP 框架开发的课堂点名工具，新增 Excel 记录未到学生功能，提供便捷的课堂点名和学生出勤管理解决方案。系统支持随机点名、缺勤记录、数据统计等功能。
主要功能：
 （1）随机点名：支持单人/多人随机点名模式
 （2）缺勤记录：一键记录未到学生信息
 （3）数据持久化：自动保存记录到 Excel 文件
 （4）可视化展示：彩色标记特殊学生状态
 （5）历史查询：查看班级缺勤历史记录
 核心模块说明：
  一、_model.js文件
  // 初始化 Excel 文件
function initExcel() {
  // 创建带表头的 Excel 文件
}
// 记录缺勤学生
exports.recordAbsentees = function(absentees, className) {
  // 添加记录到 Excel
};
二、mainfrm_pane.js
// 单人点名
function OnSingle() {
  // 随机抽取一名学生
}
// 记录缺勤
function onRecordAbsent() {
  // 调用数据模型记录当前学生
}
三、缺勤记录存储在：
   unit/erg/absent_records.xlsx

成果展示
1.点名器界面
![图片1](https://github.com/user-attachments/assets/78a46597-5d69-42bb-8dfe-05b320c104d1)
![图片2](https://github.com/user-attachments/assets/a24bc83a-0d9c-4a2e-850e-2c3ba1e6d44c)

2.缺席人员名单以及记录位置
![图片3](https://github.com/user-attachments/assets/d5b650f4-7309-4eb0-8fc4-870451a7c62d)
![图片4](https://github.com/user-attachments/assets/5606f912-2a45-4bd3-aeb2-6c9cbb22848b)






