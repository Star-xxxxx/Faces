/*
新表情系统 聊天屏蔽嵌入版
版本：Alpha2
详情见faces.js
*/
/* 以下加入配置文件中间或后面，原fl功能见原有的Max_Face_Show_Num */
    ,ms: 64, // 【注意前面有个逗号】
    dq: "top",
    fr: "https://star-xxxxx.github.io/faces",
    fb: [""],

/* 以下替代let Decode_SendContent = (Str) => { }之内的内容 */
let Decode_SendContent = (Str) => { 

    // 解码
    UseFace = 0, 
    Str = unescape(Str).replace(/</g, '&lt;').replace(/>/g, '&gt;'); // 反html
    if (Tp["oChat"]["Open_Face"]) {

        Str = Str.replace(/(\\\\\d{4})/g, (m, p) => {
            var number = parseInt(p.substr(2, 4), 10);
            ++UseFace;

            if (UseFace > Tp["oChat"]["Max_Face_Show_Num"]) {
                return p;
            }

                        var shouldIgnore = Tp["oChat"]["fb"].some(function (item) {
                            if (typeof item === 'number') {
                                return number === item;
                            } else if (typeof item === 'object' && 'start' in item && 'end' in item) {
                                return number >= item.start && number <= item.end;
                            }
                            return false;
                        });

                        if (shouldIgnore) {
                            return m;
                        }

            var imgSrc = Tp["oChat"]["fr"] + '/' + p.substr(2, 4) + '.png';
            var fallbackSrc = Tp["oChat"]["fr"] + '/' + p.substr(2, 4) + '.gif';

            if (number <= 3273) {
                            return UseFace > Tp["oChat"]["Max_Face_Show_Num"] ? m : '<img src="../images/faces/' + p.substr(2, 4) + '.gif" style="max-width: ' + Tp["oChat"]["ms"] + 'px; max-height: ' + Tp["oChat"]["ms"] + 'px; vertical-align: ' + Tp["oChat"]["dq"] + '" alt= "' + m + '" title="' + m + '">';
            } else {
                if (UseFace > Tp["oChat"]["Max_Face_Show_Num"]) {
                    return m;
                } else {
                    var imgElement = document.createElement('img');
                    imgElement.style.maxWidth = Tp["oChat"]["ms"] + 'px';
                    imgElement.style.maxHeight = Tp["oChat"]["ms"] + 'px';
                    imgElement.style.verticalAlign = Tp["oChat"]["dq"];
                    imgElement.alt = m;
                    imgElement.title = m;

                    var processed = false;

                    imgElement.onerror = function () {
                        if (!processed) {
                            imgElement.src = fallbackSrc;
                            processed = true;
                        } else {
                            imgElement.src = '';
                        }
                    };

                    imgElement.src = imgSrc;

                    return imgElement.outerHTML;
                }
            }
        });
    }

    return Str;
};
