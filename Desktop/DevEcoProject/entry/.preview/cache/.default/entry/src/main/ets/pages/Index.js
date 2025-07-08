import { CO2Page } from '@bundle:com.example.myapplication/entry/ets/pages/CO2Page';
import { WeatherPage } from '@bundle:com.example.myapplication/entry/ets/pages/WeatherPage';
import { PressurePage } from '@bundle:com.example.myapplication/entry/ets/pages/PressurePage';
import { FanControlPage } from '@bundle:com.example.myapplication/entry/ets/pages/FanControlPage';
import { AlarmControlPage } from '@bundle:com.example.myapplication/entry/ets/pages/AlarmControlPage';
import { DeepSeekPage } from '@bundle:com.example.myapplication/entry/ets/pages/DeepSeekPage';
import { LEDPage } from '@bundle:com.example.myapplication/entry/ets/pages/LEDPage';
import { InfraredPage } from '@bundle:com.example.myapplication/entry/ets/pages/Infraredpage';
import { WaterSensorPage } from '@bundle:com.example.myapplication/entry/ets/pages/WaterSensorPage';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__currentPage = new ObservedPropertySimplePU('home', this, "currentPage");
        this.__isEnvironmentMenuOpen = new ObservedPropertySimplePU(false, this, "isEnvironmentMenuOpen");
        this.__subPage = new ObservedPropertySimplePU('', this, "subPage");
        this.__sidebarCollapsed = new ObservedPropertySimplePU(false, this, "sidebarCollapsed");
        this.pageConfig = {
            environment: {
                title: '环境监测',
                icon: { "id": 16777260, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" },
                subPages: [
                    { id: 'temperature', name: '温湿度监测', icon: { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#87CEFA' },
                    { id: 'co2', name: 'CO2监测', icon: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#98FB98' },
                    { id: 'pressure', name: '压强监测', icon: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FFA07A' },
                    { id: 'light', name: '光照监测', icon: { "id": 16777246, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FFD700' },
                    { id: 'infrared', name: '红外检测', icon: { "id": 16777253, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#BA68C8' },
                    { id: 'watersensor', name: '水浸检测', icon: { "id": 16777221, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#4FC3F7' }
                ]
            },
            mainPages: [
                { id: 'fan', name: '智能新风', icon: { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FF6347' },
                { id: 'alarm', name: '安防管理', icon: { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FF4500' },
                { id: 'deepseek', name: 'AI智能分析', icon: { "id": 16777247, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#4CAF50' }
            ]
        };
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.currentPage !== undefined) {
            this.currentPage = params.currentPage;
        }
        if (params.isEnvironmentMenuOpen !== undefined) {
            this.isEnvironmentMenuOpen = params.isEnvironmentMenuOpen;
        }
        if (params.subPage !== undefined) {
            this.subPage = params.subPage;
        }
        if (params.sidebarCollapsed !== undefined) {
            this.sidebarCollapsed = params.sidebarCollapsed;
        }
        if (params.pageConfig !== undefined) {
            this.pageConfig = params.pageConfig;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__isEnvironmentMenuOpen.purgeDependencyOnElmtId(rmElmtId);
        this.__subPage.purgeDependencyOnElmtId(rmElmtId);
        this.__sidebarCollapsed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentPage.aboutToBeDeleted();
        this.__isEnvironmentMenuOpen.aboutToBeDeleted();
        this.__subPage.aboutToBeDeleted();
        this.__sidebarCollapsed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get currentPage() {
        return this.__currentPage.get();
    }
    set currentPage(newValue) {
        this.__currentPage.set(newValue);
    }
    get isEnvironmentMenuOpen() {
        return this.__isEnvironmentMenuOpen.get();
    }
    set isEnvironmentMenuOpen(newValue) {
        this.__isEnvironmentMenuOpen.set(newValue);
    }
    get subPage() {
        return this.__subPage.get();
    }
    set subPage(newValue) {
        this.__subPage.set(newValue);
    }
    get sidebarCollapsed() {
        return this.__sidebarCollapsed.get();
    }
    set sidebarCollapsed(newValue) {
        this.__sidebarCollapsed.set(newValue);
    }
    // 处理页面导航
    handleNavigation(page) {
        this.currentPage = page;
        this.subPage = '';
        this.isEnvironmentMenuOpen = false;
    }
    // 处理子页面导航
    handleSubNavigation(subPage) {
        this.subPage = subPage;
    }
    // 切换环境菜单
    toggleEnvironmentMenu() {
        this.isEnvironmentMenuOpen = !this.isEnvironmentMenuOpen;
        if (!this.isEnvironmentMenuOpen) {
            this.subPage = '';
        }
    }
    // 返回首页
    goHome() {
        this.currentPage = 'home';
        this.isEnvironmentMenuOpen = false;
        this.subPage = '';
    }
    // 切换侧边栏状态
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }
    // 菜单按钮构建器
    MenuButton(text, icon, isActive, bgColor, onClick, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithChild();
            Button.debugLine("pages/Index.ets(75:5)");
            Button.onClick(onClick);
            Button.width(this.sidebarCollapsed ? 50 : '90%');
            Button.height(50);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(isActive ? bgColor : '#F5F5F5');
            Button.borderRadius(25);
            Button.stateEffect(isActive || !this.sidebarCollapsed);
            Button.shadow(isActive ? { radius: 4, color: '#40000000', offsetX: 0, offsetY: 2 } : null);
            Button.margin({ bottom: 10 });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(76:7)");
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create(icon);
            Image.debugLine("pages/Index.ets(77:9)");
            Image.width(24);
            Image.height(24);
            Image.margin({ right: this.sidebarCollapsed ? 0 : 8 });
            Image.opacity(this.sidebarCollapsed ? 0.9 : 1);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (!this.sidebarCollapsed) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(text);
                        Text.debugLine("pages/Index.ets(83:11)");
                        Text.fontSize(16);
                        Text.fontColor(isActive ? '#FFFFFF' : '#333333');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        Row.pop();
        Button.pop();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(103:5)");
            Row.height('100%');
            Row.width('100%');
            Row.backgroundColor('#F5F7FA');
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 左侧导航栏
            Column.create({ space: 10 });
            Column.debugLine("pages/Index.ets(105:7)");
            Context.animation({ duration: 300, curve: Curve.EaseOut });
            // 左侧导航栏
            Column.width(this.sidebarCollapsed ? 80 : '25%');
            // 左侧导航栏
            Column.padding(15);
            // 左侧导航栏
            Column.backgroundColor('#FFFFFF');
            // 左侧导航栏
            Column.borderRadius(15);
            // 左侧导航栏
            Column.shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 2 });
            Context.animation(null);
            if (!isInitialRender) {
                // 左侧导航栏
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部应用标题和折叠按钮
            Row.create();
            Row.debugLine("pages/Index.ets(107:9)");
            // 顶部应用标题和折叠按钮
            Row.width('100%');
            // 顶部应用标题和折叠按钮
            Row.justifyContent(FlexAlign.Start);
            // 顶部应用标题和折叠按钮
            Row.margin({ bottom: 30 });
            if (!isInitialRender) {
                // 顶部应用标题和折叠按钮
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (!this.sidebarCollapsed) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/Index.ets(109:13)");
                        Image.width(40);
                        Image.height(40);
                        Image.margin({ right: 10 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('智能控制中心');
                        Text.debugLine("pages/Index.ets(113:13)");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#333333');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithChild();
            Button.debugLine("pages/Index.ets(118:11)");
            Button.onClick(() => this.toggleSidebar());
            Button.type(ButtonType.Circle);
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Transparent);
            Button.position({ x: this.sidebarCollapsed ? 0 : '80%' });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.sidebarCollapsed ? "→" : "←");
            Text.debugLine("pages/Index.ets(119:13)");
            Text.fontSize(20);
            Text.fontColor('#333333');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Button.pop();
        // 顶部应用标题和折叠按钮
        Row.pop();
        // 环境监测按钮
        this.MenuButton.bind(this)(this.pageConfig.environment.title, this.pageConfig.environment.icon, this.isEnvironmentMenuOpen || this.subPage !== '', '#FFCC99', () => this.toggleEnvironmentMenu());
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            // 环境监测子菜单
            if (this.isEnvironmentMenuOpen || this.subPage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Column.create({ space: 5 });
                        Column.debugLine("pages/Index.ets(145:11)");
                        Column.padding({ left: this.sidebarCollapsed ? 0 : 10 });
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.MenuButton.bind(this)(item.name, item.icon, this.subPage === item.id, item.color, () => this.handleSubNavigation(item.id));
                        };
                        this.forEachUpdateFunction(elmtId, this.pageConfig.environment.subPages, forEachItemGenFunction);
                        if (!isInitialRender) {
                            ForEach.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    ForEach.pop();
                    // 返回主界面按钮
                    this.MenuButton.bind(this)('返回主界面', { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, false, '#FFCC99', () => this.goHome());
                    Column.pop();
                });
            }
            // 主菜单按钮
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            // 主菜单按钮
            if (!this.isEnvironmentMenuOpen && !this.subPage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Column.create({ space: 5 });
                        Column.debugLine("pages/Index.ets(170:11)");
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.MenuButton.bind(this)(item.name, item.icon, this.currentPage === item.id, item.color, () => this.handleNavigation(item.id));
                        };
                        this.forEachUpdateFunction(elmtId, this.pageConfig.mainPages, forEachItemGenFunction);
                        if (!isInitialRender) {
                            ForEach.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        // 左侧导航栏
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 右侧内容区
            Column.create();
            Column.debugLine("pages/Index.ets(191:7)");
            Context.animation({ duration: 300, curve: Curve.EaseOut });
            // 右侧内容区
            Column.width(this.sidebarCollapsed ? '85%' : '75%');
            // 右侧内容区
            Column.padding(15);
            Context.animation(null);
            if (!isInitialRender) {
                // 右侧内容区
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部状态栏
            Row.create();
            Row.debugLine("pages/Index.ets(193:9)");
            // 顶部状态栏
            Row.width('100%');
            // 顶部状态栏
            Row.padding({ bottom: 15 });
            if (!isInitialRender) {
                // 顶部状态栏
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.getCurrentPageTitle());
            Text.debugLine("pages/Index.ets(194:11)");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 顶部状态栏
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 页面内容区
            Column.create();
            Column.debugLine("pages/Index.ets(203:9)");
            // 页面内容区
            Column.width('100%');
            // 页面内容区
            Column.height('100%');
            // 页面内容区
            Column.backgroundColor("#FFFFFF");
            // 页面内容区
            Column.borderRadius(15);
            // 页面内容区
            Column.shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 2 });
            // 页面内容区
            Column.padding(20);
            if (!isInitialRender) {
                // 页面内容区
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.subPage === 'temperature') {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new WeatherPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.subPage === 'co2') {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new CO2Page(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.subPage === 'pressure') {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new PressurePage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.subPage === 'light') {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new LEDPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.subPage === 'infrared') {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new InfraredPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.subPage === 'watersensor') {
                this.ifElseBranchUpdateFunction(5, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new WaterSensorPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.currentPage === 'fan') {
                this.ifElseBranchUpdateFunction(6, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new FanControlPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.currentPage === 'alarm') {
                this.ifElseBranchUpdateFunction(7, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new AlarmControlPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else if (this.currentPage === 'deepseek') {
                this.ifElseBranchUpdateFunction(8, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new DeepSeekPage(this, {}, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(9, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 默认首页内容
                        Column.create();
                        Column.debugLine("pages/Index.ets(224:13)");
                        // 默认首页内容
                        Column.width('100%');
                        // 默认首页内容
                        Column.height('100%');
                        // 默认首页内容
                        Column.justifyContent(FlexAlign.Center);
                        // 默认首页内容
                        Column.alignItems(HorizontalAlign.Center);
                        if (!isInitialRender) {
                            // 默认首页内容
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/Index.ets(225:15)");
                        Image.width('100%');
                        Image.height(200);
                        Image.objectFit(ImageFit.Cover);
                        Image.borderRadius(15);
                        Image.margin({ bottom: 20 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('欢迎使用智能控制中心');
                        Text.debugLine("pages/Index.ets(232:15)");
                        Text.fontSize(24);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 10 });
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('请从左侧菜单选择功能');
                        Text.debugLine("pages/Index.ets(237:15)");
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    // 默认首页内容
                    Column.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        // 页面内容区
        Column.pop();
        // 右侧内容区
        Column.pop();
        Row.pop();
    }
    // 获取当前页面标题
    getCurrentPageTitle() {
        if (this.subPage === 'temperature')
            return '温湿度监测';
        if (this.subPage === 'co2')
            return '二氧化碳监测';
        if (this.subPage === 'pressure')
            return '压强监测';
        if (this.subPage === 'light')
            return '光照监测';
        if (this.subPage === 'infrared')
            return '红外检测计数';
        if (this.subPage === 'watersensor')
            return '水浸传感器监测';
        if (this.currentPage === 'fan')
            return '智能新风管理';
        if (this.currentPage === 'alarm')
            return '安防管理';
        if (this.currentPage === 'deepseek')
            return 'AI智能分析';
        return '控制中心';
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { Index };
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map