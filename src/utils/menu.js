export const allMenus={
    //后台维护人员
    background:[
        {
            url:'/background/home',
            key:'backgroundHome',
            name:'首页',
            icon: 'home',
        },
        {
            url:'/background/dmk',
            key:'backgroundDmk',
            name:'代码库管理',
            icon: 'file-text',
        },
        {
          url:'/page/business/order',
          key:'businessOrder',
          name:'商品发货情况',
      }
    ],
    //业主
    owner:[
        {
            url:'/page/owner/home',
            key:'ownerHome',
            name:'首页',
        }
    ],
    //商家
    business:[
        {
            url:'/page/business/home',
            key:'businessHome',
            name:'首页',
        },
        {
            url:'/page/business/order',
            key:'businessOrder',
            name:'商品发货情况',
        },
        {
            url:'/page/business/mycommodity',
            key:'businessYycommodity',
            name:'我的商品',
        },
        {
            url:'/page/business/commoditymng',
            key:'businessCommoditymng',
            name:'商品管理',
        },
        {
            url:'/page/business/staff',
            key:'businesStaff',
            name:'员工管理',
        }
    ]
}

/**
 * 配置完整页面的路径，如果不在这里配置，则不能访问
 * @url 访问的url
 * @auth 权限，如果此链接是点击按钮打开一个新的页面，建议此处的权限和按钮的权限一致
 * @isLogin 是否必须登录才能访问，默认true
 */
export const fullPageUrl = [
  // {
    // url:'/doc/edit',
    // auth:'',
    // isLogin:true,
  // }
]
