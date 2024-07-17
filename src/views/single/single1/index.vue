<template>
  <section>
    <upload-tool @getFile="getFile" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

/* function chooseExcel(e: any) {
  const files = e.target.files;
  if (files.length <= 0) {
    return false;
  }
  else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
    ElMessage({
      message: "上传格式不正确，请上传xls或者xlsx格式！",
      type: "error",
    });
    return false;
  }
} */

const excelData = ref(null)

const readFile = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (ev) => {
      resolve(ev.target?.result)
    }
  })
}

const getFile = async (file) => {
  // console.log("文件改变后触发", file, file.raw)

  let dataBinary = await readFile(file.raw);
  console.log(dataBinary)
  let workbook = XLSX.read(dataBinary, { type: 'binary', cellDates: true });
  console.log(workbook)
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // excelData.value = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  excelData.value = XLSX.utils.sheet_to_json(worksheet, { range: 1, header: 1, defval: '' });
  console.log(excelData.value)

  // XLSX.writeFile(excelData.value, 'out.xlsx');

  // dealExcel(excelData.value);


  /* const reader = new FileReader();
  reader.readAsArrayBuffer(file.raw);
  console.log(reader) */
  /* reader.onload = (e) => {
    console.log(e)
    const data = new Uint8Array(e.target.result);
    console.log(data)
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    excelData.value = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(excelData.value)
  }; */
  // reader.readAsArrayBuffer(file);
};

function dealExcel(ws) {
  let exmap = {
    日期: "date",
    编号: "proNo",
    产品名称: "name",
    数量: "count",
  };
  ws.forEach((sourceObj) => {
    Object.keys(sourceObj).map((keys) => {
      let newKey = exmap[keys];
      if (newKey) {
        sourceObj[newKey] = sourceObj[keys];
        delete sourceObj[keys];
      }
    });
  });

  console.log(ws);
}
</script>

<style lang="scss" scoped></style>
