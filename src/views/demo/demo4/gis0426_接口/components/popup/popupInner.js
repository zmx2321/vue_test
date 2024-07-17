/**
 * 气泡窗管理
 * @param {*} popupObj 
 * @returns 
 */

// 通用气泡窗
export const commonPopupInner = popupObj => {
    // console.log('气泡窗业务数据', popupObj)

    const { popupData } = popupObj
    const positionFix = 3  // 坐标保留几位小数

    return `
        <div class="common_popup_item">
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

            <span data-function='getMore'>查看更多</span>
        </div>
    `
}

// 多个feature气泡窗
export const featuresPopupInner = (popupObj, next) => {
    let str = `
        <ul class="features_top">
            <li>${popupObj.name}</li>
            <li>类型: ${popupObj.type === 'Marker' ? '标注点' : '扇区'}</li>
        </ul>
    `

    let currentDataList = []

    // console.log(popupObj.popupData)
    popupObj.popupData.forEach(item => {
        let currentData = {}

        switch (popupObj.type) {
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

        str += `
            <div class="feature_item" data-function='getSingleByFeatures' data-cgi='${currentData.cgi}'>
                <span data-function='getSingleByFeatures' data-cgi='${currentData.cgi}'>[${currentData.networkType}] ${currentData.newCellName}</span>
                <dl data-function='getSingleByFeatures' data-cgi='${currentData.cgi}'>
                    <dt>cgi:</dt>
                    <dd>${currentData.cgi}</dd>
                </dl>
                <dl>
                    <dt>状态:</dt>
                    <dd>${currentData.cellLifeStatus}</dd>
                </dl>
            </div>
        `
    })

    next(currentDataList)  // 输出业务数据

    return str
}