// DeepSeekPage.ets
import http from '@ohos:net.http';
import prompt from '@ohos:prompt';
class DeepSeekPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.apiKey = 'sk-8e4ef725a77b44bebbe85edede82fd02';
        this.httpRequest = http.createHttp();
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.apiKey !== undefined) {
            this.apiKey = params.apiKey;
        }
        if (params.httpRequest !== undefined) {
            this.httpRequest = params.httpRequest;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue) {
        this.__inputText.set(newValue);
    }
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue) {
        this.__messages.set(newValue);
    }
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue) {
        this.__isLoading.set(newValue);
    }
    // 消息项构建器
    MessageItem(msg, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('100%');
            Column.margin({ bottom: 12 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(msg.content);
            Text.fontSize(16);
            Text.padding(10);
            Text.borderRadius(8);
            Text.width('80%');
            Text.backgroundColor(msg.role === 'user' ? '#E3F2FD' : '#F5F5F5');
            Text.align(msg.role === 'user' ? Alignment.End : Alignment.Start);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Color.White);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 消息列表区域
            List.create({ space: 10 });
            // 消息列表区域
            List.layoutWeight(1);
            // 消息列表区域
            List.width('100%');
            // 消息列表区域
            List.divider({ strokeWidth: 1, color: '#EEEEEE' });
            if (!isInitialRender) {
                // 消息列表区域
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const msg = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
                        ListItem.margin({ left: 10, right: 10 });
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const observedShallowRender = () => {
                        this.observeComponentCreation(itemCreation);
                        ListItem.pop();
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation(itemCreation);
                        this.MessageItem.bind(this)(msg);
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.MessageItem.bind(this)(msg);
                        ListItem.pop();
                    };
                    if (isLazyCreate) {
                        observedShallowRender();
                    }
                    else {
                        observedDeepRender();
                    }
                }
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, (msg, index) => index.toString(), true, true);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        // 消息列表区域
        List.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 输入区域
            Row.create({ space: 10 });
            // 输入区域
            Row.width('100%');
            // 输入区域
            Row.padding(16);
            // 输入区域
            Row.backgroundColor('#FAFAFA');
            if (!isInitialRender) {
                // 输入区域
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            TextInput.create({ text: this.inputText, placeholder: '输入问题...' });
            TextInput.onChange((value) => {
                this.inputText = value;
            });
            TextInput.height(48);
            TextInput.layoutWeight(1);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.fontSize(16);
            TextInput.borderRadius(24);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 1, color: '#E0E0E0' });
            if (!isInitialRender) {
                TextInput.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel(this.isLoading ? '加载中...' : '发送');
            Button.onClick(() => {
                if (this.inputText.trim().length > 0 && !this.isLoading) {
                    this.sendToDeepseek(this.inputText.trim());
                    this.inputText = '';
                }
            });
            Button.width(80);
            Button.height(48);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor('#2196F3');
            Button.fontColor(Color.White);
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        // 输入区域
        Row.pop();
        Column.pop();
    }
    // DeepSeek API请求方法
    async sendToDeepseek(question) {
        try {
            this.isLoading = true;
            this.messages = [...this.messages, { role: 'user', content: question }];
            const requestUrl = 'https://api.deepseek.com/v1/chat/completions';
            // const requestUrl = 'https://api.siliconflow.cn/v1/chat/completions';
            const headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this.apiKey}`
            };
            const currentData = await this.getCurrentData();
            const requestBody = {
                model: "deepseek-chat",
                // model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
                messages: [
                    { role: "system", content: `你是一个专业的环境监测分析助手，以下是当前数据集：${currentData}。请基于这些数据提供分析和建议。` },
                    ...this.messages
                ]
            };
            this.httpRequest.request(requestUrl, {
                method: http.RequestMethod.POST,
                header: headers,
                extraData: JSON.stringify(requestBody)
            }).then((response) => {
                var _a, _b, _c;
                this.isLoading = false;
                if (response.responseCode === 200) {
                    const result = JSON.parse(response.result);
                    if ((_c = (_b = (_a = result.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) {
                        this.messages = [...this.messages, {
                                role: 'assistant',
                                content: result.choices[0].message.content
                            }];
                    }
                }
                else {
                    console.error("DeepSeek API Error:", response); // 打印完整响应
                    prompt.showToast({
                        message: `请求失败: ${response.responseCode} - ${response.result}`,
                        duration: 3000
                    });
                }
            }).catch((err) => {
                this.isLoading = false;
                console.error("DeepSeek Network Error:", err); // 打印完整错误
                prompt.showToast({
                    message: `网络错误: ${err.code || err.message}`,
                    duration: 3000
                });
            });
        }
        catch (error) {
            this.isLoading = false;
            console.error("DeepSeek Exception:", error);
            prompt.showToast({
                message: `发生错误: ${error.message}`,
                duration: 3000
            });
        }
    }
    // 获取当前页面的数据集（异步版本）
    async getCurrentData() {
        try {
            // 使用await等待所有异步数据
            const [temperatureData, co2Data, pressureData] = await Promise.all([
                this.fetchTemperatureData(),
                this.fetchCO2Data(),
                this.fetchPressureData(),
            ]);
            return `温湿度数据: ${temperatureData}, CO2浓度: ${co2Data}, 压强: ${pressureData}`;
        }
        catch (error) {
            console.error('获取数据集失败:', error);
            return '无法获取数据集，请检查网络连接或API链接';
        }
    }
    // 从API获取温湿度数据
    async fetchTemperatureData() {
        try {
            const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/Weather', {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                if (rawData.length > 0 && rawData[0].value.temp !== undefined && rawData[0].value.humi !== undefined) {
                    return `${rawData[0].value.temp}°C, 湿度: ${rawData[0].value.humi}%`;
                }
            }
            return '数据获取失败';
        }
        catch (error) {
            console.error('获取温湿度数据失败:', error);
            return '数据获取失败';
        }
    }
    // 从API获取CO2数据
    async fetchCO2Data() {
        try {
            const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/CO2', {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                if (rawData.length > 0 && rawData[0].value.dioxide !== undefined) {
                    return `${rawData[0].value.dioxide}ppm`;
                }
            }
            return '数据获取失败';
        }
        catch (error) {
            console.error('获取CO2数据失败:', error);
            return '数据获取失败';
        }
    }
    // 从API获取压强数据
    async fetchPressureData() {
        try {
            const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/Pressure', {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                if (rawData.length > 0 && rawData[0].value.pressure !== undefined) {
                    return `${rawData[0].value.pressure}hPa`;
                }
            }
            return '数据获取失败';
        }
        catch (error) {
            console.error('获取压强数据失败:', error);
            return '数据获取失败';
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { DeepSeekPage };
//# sourceMappingURL=DeepSeekPage.js.map