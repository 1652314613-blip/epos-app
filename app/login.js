"use strict";
/**
 * Login Screen - Minimalist Black & White Style
 *
 * 设计特点:
 * - 黑白极简风格，与首页保持一致
 * - 简洁的排版和布局
 * - 流畅的动画效果
 * - 支持多种登录方式
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var use_colors_1 = require("@/hooks/use-colors");
var screen_container_1 = require("@/components/screen-container");
var Haptics = require("expo-haptics");
function LoginScreen() {
    var _this = this;
    var colors = (0, use_colors_1.useColors)();
    var _a = (0, react_1.useState)(""), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(""), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    // 动画值
    var fadeAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var slideAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(30)).current;
    (0, react_1.useEffect)(function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);
    var handleLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLoading(true);
            // 模拟登录
            setTimeout(function () {
                setIsLoading(false);
                expo_router_1.router.replace("/(tabs)");
            }, 1500);
            return [2 /*return*/];
        });
    }); };
    var handleGuestLogin = function () {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        expo_router_1.router.replace("/(tabs)");
    };
    var handleBack = function () {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        expo_router_1.router.back();
    };
    return (<screen_container_1.ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <react_native_1.KeyboardAvoidingView behavior={react_native_1.Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <react_native_1.ScrollView contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 40,
        }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* 返回按钮 */}
          <react_native_1.Pressable onPress={handleBack} style={function (_a) {
            var pressed = _a.pressed;
            return ({
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: colors.muted + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
                opacity: pressed ? 0.6 : 1,
            });
        }}>
            <react_native_1.Text style={{ fontSize: 20, color: colors.foreground }}>←</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
        }}>
            {/* 标题部分 */}
            <react_native_1.View style={{ marginBottom: 48 }}>
              {/* Logo */}
              <react_native_1.Text style={{
            fontSize: 32,
            fontWeight: "300",
            letterSpacing: 3,
            color: colors.foreground,
            marginBottom: 16,
        }}>
                EPOS
              </react_native_1.Text>
              
              {/* 欢迎文本 */}
              <react_native_1.Text style={{
            fontSize: 28,
            fontWeight: "600",
            color: colors.foreground,
            marginBottom: 12,
            lineHeight: 36,
        }}>
                欢迎回来
              </react_native_1.Text>
              <react_native_1.Text style={{
            fontSize: 15,
            color: colors.muted,
            lineHeight: 22,
        }}>
                登录以继续学习英语语法
              </react_native_1.Text>
            </react_native_1.View>

            {/* 登录表单 */}
            <react_native_1.View style={{ marginBottom: 32, gap: 16 }}>
              {/* 邮箱输入 */}
              <react_native_1.View>
                <react_native_1.Text style={{
            fontSize: 13,
            fontWeight: "500",
            color: colors.foreground,
            marginBottom: 8,
            letterSpacing: 0.5,
        }}>
                  邮箱地址
                </react_native_1.Text>
                <react_native_1.TextInput value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor={colors.muted + "80"} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} style={{
            backgroundColor: colors.muted + "10",
            borderWidth: 1,
            borderColor: colors.muted + "30",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 15,
            color: colors.foreground,
            fontFamily: react_native_1.Platform.OS === "ios" ? "System" : "sans-serif",
        }}/>
              </react_native_1.View>

              {/* 密码输入 */}
              <react_native_1.View>
                <react_native_1.Text style={{
            fontSize: 13,
            fontWeight: "500",
            color: colors.foreground,
            marginBottom: 8,
            letterSpacing: 0.5,
        }}>
                  密码
                </react_native_1.Text>
                <react_native_1.TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.muted + "80"} secureTextEntry editable={!isLoading} style={{
            backgroundColor: colors.muted + "10",
            borderWidth: 1,
            borderColor: colors.muted + "30",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 15,
            color: colors.foreground,
            fontFamily: react_native_1.Platform.OS === "ios" ? "System" : "sans-serif",
        }}/>
              </react_native_1.View>

              {/* 忘记密码 */}
              <react_native_1.Pressable style={function (_a) {
            var pressed = _a.pressed;
            return ({
                alignSelf: "flex-end",
                opacity: pressed ? 0.6 : 1,
            });
        }}>
                <react_native_1.Text style={{
            fontSize: 13,
            color: colors.muted,
            fontWeight: "500",
        }}>
                  忘记密码?
                </react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* 登录按钮 */}
            <react_native_1.Pressable onPress={handleLogin} disabled={isLoading} style={function (_a) {
            var pressed = _a.pressed;
            return ({
                backgroundColor: colors.foreground,
                borderRadius: 10,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 24,
                opacity: pressed || isLoading ? 0.7 : 1,
            });
        }}>
              <react_native_1.Text style={{
            fontSize: 15,
            fontWeight: "600",
            color: colors.background,
            letterSpacing: 0.5,
        }}>
                {isLoading ? "登录中..." : "登录"}
              </react_native_1.Text>
            </react_native_1.Pressable>

            {/* 分隔线 */}
            <react_native_1.View style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 24,
        }}>
              <react_native_1.View style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.muted + "30",
        }}/>
              <react_native_1.Text style={{
            marginHorizontal: 16,
            fontSize: 13,
            color: colors.muted,
        }}>
                或
              </react_native_1.Text>
              <react_native_1.View style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.muted + "30",
        }}/>
            </react_native_1.View>

            {/* 第三方登录 */}
            <react_native_1.View style={{ gap: 12, marginBottom: 24 }}>
              <SocialLoginButton icon="🍎" text="使用 Apple 登录" colors={colors} onPress={function () { }}/>
              <SocialLoginButton icon="🔵" text="使用 Google 登录" colors={colors} onPress={function () { }}/>
            </react_native_1.View>

            {/* 游客登录 */}
            <react_native_1.Pressable onPress={handleGuestLogin} style={function (_a) {
            var pressed = _a.pressed;
            return ({
                paddingVertical: 12,
                alignItems: "center",
                opacity: pressed ? 0.6 : 1,
            });
        }}>
              <react_native_1.Text style={{
            fontSize: 15,
            color: colors.muted,
            fontWeight: "500",
        }}>
                以游客身份继续
              </react_native_1.Text>
            </react_native_1.Pressable>

            {/* 注册提示 */}
            <react_native_1.View style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 32,
            gap: 4,
        }}>
              <react_native_1.Text style={{
            fontSize: 14,
            color: colors.muted,
        }}>
                还没有账号?
              </react_native_1.Text>
              <react_native_1.Pressable style={function (_a) {
        var pressed = _a.pressed;
        return ({ opacity: pressed ? 0.6 : 1 });
    }}>
                <react_native_1.Text style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.foreground,
        }}>
                  立即注册
                </react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.ScrollView>
      </react_native_1.KeyboardAvoidingView>
    </screen_container_1.ScreenContainer>);
}
// 第三方登录按钮组件
function SocialLoginButton(_a) {
    var icon = _a.icon, text = _a.text, colors = _a.colors, onPress = _a.onPress;
    return (<react_native_1.Pressable onPress={onPress} style={function (_a) {
            var pressed = _a.pressed;
            return ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.muted + "15",
                borderWidth: 1,
                borderColor: colors.muted + "30",
                borderRadius: 10,
                paddingVertical: 14,
                opacity: pressed ? 0.6 : 1,
                gap: 12,
            });
        }}>
      <react_native_1.Text style={{ fontSize: 18 }}>{icon}</react_native_1.Text>
      <react_native_1.Text style={{
            fontSize: 14,
            fontWeight: "500",
            color: colors.foreground,
        }}>
        {text}
      </react_native_1.Text>
    </react_native_1.Pressable>);
}
