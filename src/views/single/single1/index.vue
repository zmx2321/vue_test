<template>
  <section>
    <upload-tool @verifyFileType="verifyFileType" @getFile="getFile">
      <template #tip>
        <span>请上传xls或者xlsx格式</span>
      </template>
    </upload-tool>

    <div class="detail_wrap">
      <div class="detail_cont" v-if="JSON.stringify(excelResData) !== '[]'" v-for="(item, index) in excelResData"
        :key="index">
        <h3>{{ item.sheetName }}</h3>
        <div class="table_detail" v-html="dealExcel(item.sheetList)"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

const excelResData = ref([])

const readFile = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (ev) => {
      resolve(ev.target?.result)
    }
  })
}

const sheetToTable = sheet => {
  // 创建一个<table>元素
  var table = document.createElement('table');
  // table.setAttribute('border', '1');
  // 遍历XLSX.utils.sheet_to_json的结果
  sheet.forEach(function (row) {
    // 创建一个<tr>元素
    var tr = document.createElement('tr');
    // 遍历每一行的键值对
    for (var key in row) {
      // 创建一个<td>元素
      var td = document.createElement('td');
      // 设置<td>元素的文本
      td.appendChild(document.createTextNode(row[key]));
      // 将<td>元素添加到<tr>元素中
      tr.appendChild(td);
    }
    // 将<tr>元素添加到<table>元素中
    table.appendChild(tr);
  });
  // 将<table>元素添加到HTML文档中
  return table
  // document.body.appendChild(table);
}

const verifyFileType = (file, next) => {
  if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
    ElMessage({
      message: "上传格式不正确，请上传xls或者xlsx格式！",
      type: "error",
    });
    next(false)
    return
  }
  next(true)
}

const getFile = async (file) => {
  let dataBinary = await readFile(file.raw);
  let workbook = XLSX.read(dataBinary, { type: 'binary', cellDates: true });

  workbook.SheetNames.forEach(SheetName => {
    // workbook.Sheets[SheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName], { range: 1, header: 1, defval: '' })
    workbook.Sheets[SheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName], { header: 1, defval: '' })
  })

  for (let key in workbook.Sheets) {
    excelResData.value.push({
      sheetName: key,
      sheetList: workbook.Sheets[key]
    })
  }
};

const dealExcel = (sheetList) => {
  return sheetToTable(sheetList).outerHTML
}
</script>

<style lang="scss" scoped>
.detail_wrap {
  padding: 20px;
  width: 95%;
  height: 80vh;
  border: solid 1px #ccc;
  margin: 0 auto;
  overflow: auto;

  .detail_cont {
    &:not(:last-child) {
      margin-bottom: 50px;
    }

    h3 {
      margin-bottom: 10px;
    }

    :deep .table_detail {
      table {
        tbody {
          tr {
            &:first-child {
              background-color: #a3a3a3;
            }

            &:not(:first-child) {
              &:nth-child(odd) {
                background-color: rgb(206, 206, 206);
              }
            }
          }
        }

        td {
          padding: 5px;
          min-width: 100px;
          border: solid 1px #efefef;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
