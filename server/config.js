const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: '',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '172.21.0.17',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wzaacc1801',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 区域
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'wximg-1256074910',
        // 文件夹
        uploadFolder: './wxapp'
    },
    
    //当前服务器的hostname
    serverHost: 'https://www.bemyeyes.com.cn',
    //tunnelServerUrl - 必填。信道服务器地址
    tunnelServerUrl:'https://ws.qcloud.com',
    //tunnelSignatureKey - 必填。信道服务签名密钥
    tunnelSignatureKey : 'wuzhangaizjn',
    //qcloudAppId - 必填。腾讯云 AppId
    qcloudAppId : '1256074910',
    //qcloudSecretId - 必填。腾讯云 SecretId
    qcloudSecretId : 'AKID2uXv404RyIPHvLAXIn45qLcfSzGLqm7D',
    //qcloudSecretKey - 必填。腾讯云 SecretKey
    qcloudSecretKey : '5vWs1vZw4xe5IH1WmnZIrBJFwObYGk13',
    //wxMessageToken - 必填。微信客服消息通知 toke
    wxMessageToken : 'wxapp',
    // 微信登录态有效期
    wxLoginExpires: 7200,
}

module.exports = process.env.NODE_ENV === 'local' ? Object.assign({}, CONF, require('./config.local')) : CONF;
