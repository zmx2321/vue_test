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

// 通用气泡窗
export const commonPopupInner = popupObj=> {
    console.log('气泡窗业务数据', popupObj)

    const { popupData} = popupObj
    const positionFix = 3  // 坐标保留几位小数

    return `
        <h3>${popupData.newCellName}</h3>
        <ul>
            <li>
                <dl>
                    <dt>区县:</dt>
                    <dd>${popupData.county}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>cgi:</dt>
                    <dd>${popupData.cgi}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>基站类型:</dt>
                    <dd>${popupData.coverType}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>站号:</dt>
                    <dd>${popupData.stationNo}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>频段:</dt>
                    <dd>${popupData.workFrequency}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>小区生命周期状态:</dt>
                    <dd>${popupData.cellLifeStatus}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>经纬度:</dt>
                    <dd>[${popupObj.coordinate[0].toFixed(positionFix)}, ${popupObj.coordinate[1].toFixed(positionFix)}]</dd>
                </dl>
            </li>
        </ul>

        <span data-function='getMore'>更多>></span>
    `
    // return `
    //     <p>你点击了这里：</p>
    //     <p>经纬度：<p><code> ${popupObj.hdms}  </code> <p>
    //     <p>坐标：</p>X：${popupObj.coordinate[0]} &nbsp;&nbsp; Y: ${popupObj.coordinate[1]}
    //     <p>数据: ${popupObj.popupData}</p>
    // `
}

// 多个feature气泡窗
export const featuresPopupInner = (popupObj, next)=> {
    /* console.log('多个feature气泡窗', popupObj)
    console.log('多个feature气泡窗', popupObj.popupData) */

    let str = `
        <p>${popupObj.name}</p>
        <p>类型: ${popupObj.type === 'Marker' ? '标注点' : '扇区'}</p>
    `

    let currentDataList = []

    // console.log(popupObj.popupData)
    popupObj.popupData.forEach(item=> {
        let currentData = {}

        switch(popupObj.type) {
            case 'Marker': 
                currentData = item.get('pointData')
                break;
            case 'Curve': 
                currentData = item.get('curveData')
                break;
        }
        // console.log("feature业务数据000", currentData)
        currentDataList.push(currentData)

        switch (currentData.networkType) {
            case '4g':
                currentData.newCellName = currentData.cellName
                break
            case '5g':
                currentData.newCellName = currentData.nrCellName
                break
        }

        str+= `
            <p data-function='getSingleByFeatures' data-cgi='${currentData.cgi}'>cgi:${currentData.cgi}</p>
        `
    })

    next(currentDataList)  // 输出业务数据

    return str
}