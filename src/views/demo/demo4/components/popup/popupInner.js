export const pointPopupInner = (popupObj)=> {
    return `
        <p>你点击了这里：</p>
        <p>经纬度：<p><code> ${popupObj.hdms}  </code> <p>
        <p>坐标：</p>X：${popupObj.coordinate[0]} &nbsp;&nbsp; Y: ${popupObj.coordinate[1]},
        <p>数据: ${popupObj.popupData}</p>
        `
}

export const curvePopupInner = (popupObj)=> {
    return `
        <p>你点击了这里：</p>
        <p>经纬度：<p><code> ${popupObj.hdms}  </code> <p>
        <p>坐标：</p>X：${popupObj.coordinate[0]} &nbsp;&nbsp; Y: ${popupObj.coordinate[1]}
        <p>数据: ${popupObj.popupData}</p>
        `
}
// <p>数据: ${popupObj.popupData}</p>