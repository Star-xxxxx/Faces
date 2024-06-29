/*
新表情系统
版本：Alpha1
一些代码是ChatGPT写的
以下是配置
*/
var fl = 100; // 表情数量上限，表情黑名单屏蔽的也计入在内
var ms = 48; // 表情图像的最大高度
var dq = "top"; // 为"top"时有表情的聊天行向下拓展，为"bottom"时向上拓展（接近原版效果）
var fr = "https://star-xxxxx.github.io/faces" // 表情来源，默认为"https://star-xxxxx.github.io/faces"
var fb = []; // 表情黑名单，具体如下
/*
以下为fb的例子
var fb = [
    { start: 0000, end: 3273 },   // 屏蔽0000~3273编号区间的原版表情示例
    6000,   // 屏蔽编号为6000的单个表情示例
    { start: 3900, end: 3999 }    // 屏蔽3900~3999编号区间的表情示例
];
*/


ChatView.AjaxChat = function () {
    Ajax('asp/GetChat.asp?T=' + ChatView.T + '&' + Math.random(),
        'get',
        null,
        function (s) {
            ChatView.ClearScreen(s);
            var ar, i, SendTime, SendContent, SendAuthority, ar1, ar2, bl, fn = 0;
            if (s != '') { //没有最新发言，不刷新不滚屏
                i = (ar = s.split(',,,')).length;

                while (i--) {
                    fn = 0;
                    ar1 = ar[i].split(',,');
                    if ((SendTime = Math.floor(ar1[0])) <= ChatView.T) continue;
                    ar2 = ar1[1].split(',');
                    if (ar2[0].search("游客") > -1) continue;
                    SendContent = unescape(ar2[1]); //发送内容
                    SendContent = SendContent.replace(/</g, '&lt;');
                    SendContent = SendContent.replace(/>/g, '&gt;');

                    /* 代码起始点 */
                    SendContent = SendContent.replace(/(\\\\\d{4})/g, function (m, p) {
                        var number = parseInt(p.substr(2, 4), 10);
                        ++fn;

                        // 检查是否在 fb 中设置的范围内
                        var shouldIgnore = fb.some(function (item) {
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

                        var imgSrc = fr + '/' + p.substr(2, 4) + '.png';
                        var fallbackSrc = fr + '/' + p.substr(2, 4) + '.gif';

                        if (number <= 3273) {
                            return fn > fl ? m : '<img src="../images/faces/' + p.substr(2, 4) + '.gif" style="max-width: ' + ms + 'px; max-height: ' + ms + 'px; vertical-align: ' + dq + '">';
                        } else {
                            if (fn > fl) {
                                return m;
                            } else {
                                var imgElement = document.createElement('img');
                                imgElement.style.maxWidth = ms + 'px';
                                imgElement.style.maxHeight = ms + 'px';
                                imgElement.style.verticalAlign = dq;

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
                    /* 代码终止点 */
                    SendContent = SendContent.replace(/@(.{3,25})[\s]{1}/, function (m, p) { //@人
                        if (p == UserName) {
                            return '<span style="color:#2d64b3">@<b>' + p + '</b> ';
                        } else {
                            return m;
                        }
                    });

                    SendAuthority = Math.floor(ar2[2]);
                    NewEle(0, 'div', 'float:left;min-height:20px;line-height:20px;word-break:break-all;position:relative;width:100%;', {
                        'innerHTML': '<span style="font-family:幼圆;color:#005">' + (new Date(SendTime)).format("hh:mm:ss") + '</span> <span style="' + (SendAuthority > 0 ? 'font-weight:bold;' : '') + 'color:' + { 0: '#000', 1: '#005', 255: '#00F' }[SendAuthority] + '">' + ar2[0] + ':</span> ' + SendContent
                    }, ChatView.dbody);

                    ChatView.T = SendTime;
                    ++ChatView.childNodes;
                }
                ChatView.dbody.scrollTop = 10000; //此处也被修改
            }
        }
    );
};
