/**
 * 气泡窗管理
 * @param {*} popupObj 
 * @returns 
 */

// 标注气泡窗
export const pointPopupInner = (popupObj)=> {
    return `
        <p>你点击了这里：</p>
        <p>经纬度：<p><code> ${popupObj.hdms}  </code> <p>
        <p>坐标：</p>X：${popupObj.coordinate[0]} &nbsp;&nbsp; Y: ${popupObj.coordinate[1]},
        <p>数据: ${popupObj.popupData}</p>
        `
}

// 扇形气泡窗
export const curvePopupInner = (popupObj)=> {
    return `
        <p>你点击了这里：</p>
        <p>经纬度：<p><code> ${popupObj.hdms}  </code> <p>
        <p>坐标：</p>X：${popupObj.coordinate[0]} &nbsp;&nbsp; Y: ${popupObj.coordinate[1]}
        <p>数据: ${popupObj.popupData}</p>
        `
}

// 多个feature气泡窗
export const featuresPopupInner = (popupObj)=> {
    console.log('多个feature气泡窗', popupObj)
    console.log('多个feature气泡窗', popupObj.popupData)

    let str = `
        <p>${popupObj.name}</p>
        <p>类型: ${popupObj.type === 'Marker' ? '标注点' : '扇区'}</p>
    `

    popupObj.popupData.forEach(item=> {
        let currentData = []

        switch(popupObj.type) {
            case 'Marker': 
                currentData = item.get('pointData')
                break;
            case 'Curve': 
                currentData = item.get('curveData')
                break;
        }
        console.log("feature业务数据", currentData)

        str+= `
            <p>位置:${currentData.machineRoom}</p>
        `
    })

    return str
}