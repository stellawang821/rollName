////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
        OnMulti();
}

function OnCloseForm() {

}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

var g_studengs = [
        '汤鹏强',
        '沈佳琦',
        '李思翰',
        '张博铭#',
        '闫凯秀',
        '郭伟鹏',
        '刘帆',
        '王旭',
        '李丰冶',
        '桂董圆',
        '吴冠龙',
        '汪宇飞',
        '程果',
        '赵骏豪',
        '黄超',
        '刘佳强',
        '王骏杰',
        '陈立浩',
        '赵新晨',
        '王馨珞*',
        '马宇翔',
        '张宇',
        '杨永泉'
];

function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0),
            i = arr.length,
            min = i - count,
            temp, index;
        while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
        }
        return shuffled.slice(min);
}

function callStudent(num) {
        var students = getRandomArrayElements(g_studengs, num);
        ui.list.table = [
                ['姓名']
        ].concat((students.map(item => {
                return [item];
        })));

        var idx = 0;
        var colors = students.map(item => { //@item.@String colors.@Array
                if (item.indexOf('*') !== -1) {return [idx++, 0, '#00FF00'];}
                if (item.indexOf('#') !== -1) {return [idx++, 0, '#00FFFF'];}
                return [idx++, 0, '#FFFF00'];
        });

        colors.forEach(item => {
                ui.list.color = item;
        });

        ui.list.head_size = [0];
}

function onRecordAbsent() {
        try {
                const student = ui.list.table[1][0];
                const success = model.recordAbsentees([student], "工业底层软件架构班级");
        
                if (success) {
                        ui.label.value = `<span style='color:red'>已记录 ${student} 未到</span>`;
                        parent.setTimeout(OnSingle, 1500);
                } else {
                        ui.label.value = `<span style='color:red'>记录失败，请检查控制台</span>`;
                }
        } catch (e) {
                console.error("按钮点击错误:", e);
                ui.label.value = `<span style='color:red'>系统错误: ${e.message}</span>`;
        }
}

function OnSingle() {
        callStudent(1);
        ui.label.value = "<span style='color:blue'><h1><b>" + ui.list.table[1][0] + "</h1></b></span>";
        ui.index.index = 1;
}

function OnMulti() {
        callStudent(8);
        ui.index.index = 0;
}

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

/*Usage of BLOCK_EVENT
        BLOCK_EVENT(()=>{
                ui.[name].[var] = ...;
        });
*/

function BLOCK_EVENT(cb) {
        ui.block_event = true;

        cb();

        ui.block_event = false;
}
