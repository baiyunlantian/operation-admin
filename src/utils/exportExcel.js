import ExportJSONExcel from 'js-export-excel';
import { ElMessage } from 'element-plus'

export default function (tableData, tableTitle, fileName = '导出数据') {
  if (Array.isArray(tableData) && Array.isArray(tableTitle)) {

    if (tableData.length === 0) {
      ElMessage({
        type: 'info',
        message: '没有可供导出的信息'
      })
      return
    }

    if (tableTitle.length === 0) {
      console.log('表头不能为空')
      return
    }

    let options = {}, exportData = [];

    tableData.forEach((item, index)=>{
      let obj = {}
      tableTitle.forEach(({label, prop}) => {
        obj[label] = item[prop]
      })

      exportData.push(obj)
    })

    options.fileName = fileName;
    options.datas = [
      {
        sheetData: exportData,
        sheetHeader: tableTitle.map(item=>item.label),
        sheetFilter: tableTitle.map(item=>item.label),
      }
    ]

    const ExcelObj = new ExportJSONExcel(options);
    ExcelObj.saveExcel();
  }
}

