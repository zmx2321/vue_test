import c from"./UploadTool-d7485d5a.js";import"./base-7f461f21.js";/* empty css                   */import{_ as p,I as r}from"./index-2f9b54b2.js";import{i,a as d,L as x,M as m,o as u,ah as f,ai as y,b as t}from"./vue-8dccad75.js";const a=e=>(f("data-v-4673f6e2"),e=e(),y(),e),h=a(()=>t("span",null,"请上传xls或者xlsx格式",-1)),g=a(()=>t("div",{class:"detail_wrap"},null,-1)),v={__name:"index",setup(e){i([]);const _=(s,o)=>{if(!/\.(xls|xlsx)$/.test(s.name.toLowerCase())){r({message:"上传格式不正确，请上传xls或者xlsx格式！",type:"error"}),o(!1);return}o(!0)},n=async s=>{};return(s,o)=>{const l=c;return u(),d("section",null,[x(l,{onVerifyFileType:_,onGetFile:n},{tip:m(()=>[h]),_:1}),g])}}},V=p(v,[["__scopeId","data-v-4673f6e2"]]);export{V as default};
