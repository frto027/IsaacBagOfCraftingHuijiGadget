(function($){
    
    //@debug-only
    //这一段将CraftingUI.css嵌入到js中加载（调试用）
    {
        //补充CraftingUI.css的内容
        let elem = document.createElement('style')
        elem.textContent =/*@read-file*/'CraftingUI.css'
        document.head.appendChild(elem)
    }
    function str2seed(seed){
        if(seed.length != 9)
            return 0
        //"xxxx xxxx"
        if(seed[4] != ' '){
            return 0
        }
    
        let dict = []
        for(let i=0;i<255;i++){
            dict[i] = 0xFF
        }
        for(let i=0;i<32;i++){
            dict["ABCDEFGHJKLMNPQRSTWXYZ01234V6789".charCodeAt(i)]=i
        }
    
        let num_seed = []
        for(let i=0;i<9;i++){
            if(i == 4)
                continue
            let j = i
            if(i > 4){
                j = i-1
            }
            num_seed[j] = dict[seed.charCodeAt(i)]
            if(num_seed[j] == 0xFF)
                return 0
        }
    
        let v8 = 0;
        let v10
    
        //num_seed[x] j is unsigned int8
        for (let j = ((num_seed[6] >>> 3) | (4
                                        * (num_seed[5] | (32
                                                        * (num_seed[4] | (32
                                                                        * (num_seed[3] | (32
                                                                                        * (num_seed[2] | (32 * (num_seed[1] | (32 * num_seed[0])))))))))))) ^ 0xFEF7FFD;
            j != 0;
            v8 = ((v10 >>> 7) + 2 * v10) & 0xFF)
        {
            v10 = ((j & 0xFF) + v8) & 0xFF;
            j >>>= 5;
        }
        if ( v8 == (num_seed[7] | (0xFF & (32 * num_seed[6])))){
            return ((num_seed[6] >> 3) | (4
                * (num_seed[5] | (32
                                * (num_seed[4] | (32
                                                * (num_seed[3] | (32
                                                                        * (num_seed[2] | (32 * (num_seed[1] | (32 * num_seed[0])))))))))))) ^ 0xFEF7FFD;
        }
        return 0
    }
    //@debug-only
    console.assert(str2seed('JKD9 Z0C9') == 1302889765)

    //对item_array进行桶排序
    function bucket_sort_list_toint64(item_array){

        //@debug-only
        console.assert(item_array.length == 8)
    
        let item_count = []
    
        //initial value
        for(let i=0;i<0x1F;i++){
            item_count[i] = 0
        }
    
        item_count[item_array[0]]++
        item_count[item_array[1]]++
        item_count[item_array[2]]++
        item_count[item_array[3]]++
        item_count[item_array[4]]++
        item_count[item_array[5]]++
        item_count[item_array[6]]++
        item_count[item_array[7]]++
    
        let offset = BigInt(0)
    
        
        let v12 = BigInt(0) // v12 is 64 bit
        for(let i=BigInt(0);i<BigInt(0x1F);i++){
            for(let j=0;j<item_count[i];j++){
                //此代码一定会执行8遍
                v12 |= i << offset
                offset += BigInt(8)
            }
        }
        //v12 = 0x08 07 06 05 04 03 02 01
        return v12
    }

    //@debug-only
    console.assert(bucket_sort_list_toint64([0x16,0x2,0x16,0x16,0x16,0x16,0x16,0x16]) == 0x1616161616161602n)

    //游戏中的随机数字生成器
    let rng_offsets = [
        0x00000001, 0x00000005, 0x00000010, 0x00000001, 0x00000005, 0x00000013, 0x00000001, 0x00000009,
        0x0000001D, 0x00000001, 0x0000000B, 0x00000006, 0x00000001, 0x0000000B, 0x00000010, 0x00000001,
        0x00000013, 0x00000003, 0x00000001, 0x00000015, 0x00000014, 0x00000001, 0x0000001B, 0x0000001B,
        0x00000002, 0x00000005, 0x0000000F, 0x00000002, 0x00000005, 0x00000015, 0x00000002, 0x00000007,
        0x00000007, 0x00000002, 0x00000007, 0x00000009, 0x00000002, 0x00000007, 0x00000019, 0x00000002,
        0x00000009, 0x0000000F, 0x00000002, 0x0000000F, 0x00000011, 0x00000002, 0x0000000F, 0x00000019,
        0x00000002, 0x00000015, 0x00000009, 0x00000003, 0x00000001, 0x0000000E, 0x00000003, 0x00000003,
        0x0000001A, 0x00000003, 0x00000003, 0x0000001C, 0x00000003, 0x00000003, 0x0000001D, 0x00000003,
        0x00000005, 0x00000014, 0x00000003, 0x00000005, 0x00000016, 0x00000003, 0x00000005, 0x00000019,
        0x00000003, 0x00000007, 0x0000001D, 0x00000003, 0x0000000D, 0x00000007, 0x00000003, 0x00000017,
        0x00000019, 0x00000003, 0x00000019, 0x00000018, 0x00000003, 0x0000001B, 0x0000000B, 0x00000004,
        0x00000003, 0x00000011, 0x00000004, 0x00000003, 0x0000001B, 0x00000004, 0x00000005, 0x0000000F,
        0x00000005, 0x00000003, 0x00000015, 0x00000005, 0x00000007, 0x00000016, 0x00000005, 0x00000009,
        0x00000007, 0x00000005, 0x00000009, 0x0000001C, 0x00000005, 0x00000009, 0x0000001F, 0x00000005,
        0x0000000D, 0x00000006, 0x00000005, 0x0000000F, 0x00000011, 0x00000005, 0x00000011, 0x0000000D,
        0x00000005, 0x00000015, 0x0000000C, 0x00000005, 0x0000001B, 0x00000008, 0x00000005, 0x0000001B,
        0x00000015, 0x00000005, 0x0000001B, 0x00000019, 0x00000005, 0x0000001B, 0x0000001C, 0x00000006,
        0x00000001, 0x0000000B, 0x00000006, 0x00000003, 0x00000011, 0x00000006, 0x00000011, 0x00000009,
        0x00000006, 0x00000015, 0x00000007, 0x00000006, 0x00000015, 0x0000000D, 0x00000007, 0x00000001,
        0x00000009, 0x00000007, 0x00000001, 0x00000012, 0x00000007, 0x00000001, 0x00000019, 0x00000007,
        0x0000000D, 0x00000019, 0x00000007, 0x00000011, 0x00000015, 0x00000007, 0x00000019, 0x0000000C,
        0x00000007, 0x00000019, 0x00000014, 0x00000008, 0x00000007, 0x00000017, 0x00000008, 0x00000009,
        0x00000017, 0x00000009, 0x00000005, 0x0000000E, 0x00000009, 0x00000005, 0x00000019, 0x00000009,
        0x0000000B, 0x00000013, 0x00000009, 0x00000015, 0x00000010, 0x0000000A, 0x00000009, 0x00000015,
        0x0000000A, 0x00000009, 0x00000019, 0x0000000B, 0x00000007, 0x0000000C, 0x0000000B, 0x00000007,
        0x00000010, 0x0000000B, 0x00000011, 0x0000000D, 0x0000000B, 0x00000015, 0x0000000D, 0x0000000C,
        0x00000009, 0x00000017, 0x0000000D, 0x00000003, 0x00000011, 0x0000000D, 0x00000003, 0x0000001B,
        0x0000000D, 0x00000005, 0x00000013, 0x0000000D, 0x00000011, 0x0000000F, 0x0000000E, 0x00000001,
        0x0000000F, 0x0000000E, 0x0000000D, 0x0000000F, 0x0000000F, 0x00000001, 0x0000001D, 0x00000011,
        0x0000000F, 0x00000014, 0x00000011, 0x0000000F, 0x00000017, 0x00000011, 0x0000000F, 0x0000001A]
    
    function RNG_Next(num, offset_id){
        let offset_a = rng_offsets[offset_id * 3]
        let offset_b = rng_offsets[offset_id * 3 + 1]
        let offset_c = rng_offsets[offset_id * 3 + 2]
        num = num ^ ((num >>> offset_a) & 0xFFFFFFFF)
        num = num ^ ((num << offset_b) & 0xFFFFFFFF)
        num = num ^ ((num >>> offset_c) & 0xFFFFFFFF)
        return num >>> 0 /* to unsigned */
    }
    
    /* 道具池和品质的数据经过压缩，压缩算法参考github文件compress.js */
    let item_pool_data = []
    let item_config_data = {}
    /* 解压缩 */
    let compressed = /*@read-file*/'out/compressed.json'
    compressed = JSON.parse(compressed)
    let item_pool_data_compressed = compressed.item_pool_data_compressed
    for(let i=0;i<item_pool_data_compressed.length;i++){
        item_pool = []
        item_pool_compressed = item_pool_data_compressed[i]
        for(let weight in item_pool_compressed){
            for(let j=0;j<item_pool_compressed[weight].length;j++){
                let id = item_pool_compressed[weight][j]
                item_pool.push({id:id,weight:weight})
            }
        }
    
        item_pool_data[i] = item_pool
    }
    let item_config_data_compressed = compressed.item_config_data_compressed
    
    for(let quality in item_config_data_compressed){
        for(let i=0;i<item_config_data_compressed[quality].length;i++){
            let id = item_config_data_compressed[quality][i]
            item_config_data[id]={quality:quality}
        }
    }

    for(let i = 0;i< compressed.id_with_achievement.length;i++){
        let id = compressed.id_with_achievement[i]
        item_config_data[id].achievement_id = true
    }
    /* 解压完毕 */
    
    function GetItemPoolData(item_pool_id){
        //@debug-only
        console.assert(item_pool_data[item_pool_id] != undefined)
        return item_pool_data[item_pool_id]
    }
    function GetItemConfig(item_id){
        //@debug-only
        console.assert(item_config_data[item_id] != undefined)
        return item_config_data[item_id]
    }
    function GetAchievementUnlocked(achievement_id){
        return achievement_id == undefined || achievement_id == false
    }
    
    //预先确定的配方
    let recipe_predefine_list = [
        {input:BigInt("0x0101010101010101"),output:0x2D},
        {input:BigInt("0x0808080808080808"),output:0xB1},
        {input:BigInt("0x1D1D1D1D1D1D1D1D"),output:0x24},
        {input:BigInt("0x0202020202020202"),output:0x2AE},
        {input:BigInt("0x1515151515151515"),output:0x55},
        {input:BigInt("0x1919191919191919"),output:0x244},
        {input:BigInt("0x0404040404040404"),output:0xB6},
        {input:BigInt("0x0F0F0F0F0F0F0F0F"),output:0x25},
        {input:BigInt("0x1616161616161616"),output:0x4B},
        {input:BigInt("0x1818181818181818"),output:0x1E9},
        {input:BigInt("0x0303030303030303"),output:0x76},
        {input:BigInt("0x0606060606060606"),output:0x274},
        {input:BigInt("0x0C0C0C0C0C0C0C0C"),output:0x157},
        {input:BigInt("0x1111111111111111"),output:0x1E3},
        {input:BigInt("0x1616161616161603"),output:0x28E},
        {input:BigInt("0x0504040404040201"),output:0x14B},
        {input:BigInt("0x0707010101010101"),output:0x27F},
        {input:BigInt("0x0D0D0C0C0C0C0C0C"),output:0xAF},
        {input:BigInt("0x10100F0F0F0F0F0F"),output:0x1E3},
    ]

    //input_array是长度为8的数组，表示配方，gameStartSeed是一个32位随机数字，需要用str2seed计算
    function get_result(input_array, gameStartSeed){
        let sorted_items = bucket_sort_list_toint64(input_array)

        //先过滤预先确定好的配方
        for(let i=0;i<recipe_predefine_list.length;i++){
            if(recipe_predefine_list[i].input == sorted_items)
                return [recipe_predefine_list[i].output]
        }
    
        //然后是游戏中的算法,后面这段没必要看懂，因为是从游戏里抄出来的，总之它返回道具id
        let item_count = []
        for(let i=0;i<0x1F;i++){
            item_count[i] = 0
        }
        item_count[input_array[0]]++
        item_count[input_array[1]]++
        item_count[input_array[2]]++
        item_count[input_array[3]]++
        item_count[input_array[4]]++
        item_count[input_array[5]]++
        item_count[input_array[6]]++
        item_count[input_array[7]]++
        
        let score_matrix = [
            0x00000000, 0x00000001, 0x00000004, 0x00000005, 0x00000005, 0x00000005, 0x00000005,
            0x00000001, 0x00000001, 0x00000003, 0x00000005, 0x00000008, 0x00000002, 0x00000007, 
            0x00000005, 0x00000002, 0x00000007, 0x0000000A, 0x00000002, 0x00000004, 0x00000008, 
            0x00000002, 0x00000002, 0x00000004, 0x00000004, 0x00000002, 0x00000007, 0x00000007, 
            0x00000007, 0x00000000, 0x00000001]
        
        let item_score_sum = 
            score_matrix[input_array[0]] + 
            score_matrix[input_array[1]] + 
            score_matrix[input_array[2]] + 
            score_matrix[input_array[3]] + 
            score_matrix[input_array[4]] + 
            score_matrix[input_array[5]] + 
            score_matrix[input_array[6]] + 
            score_matrix[input_array[7]]

        // console.log("item score sum = " + item_score_sum)
        let weight_list = [
            {id:0,weight:1.0},
            {id:1,weight:2.0},
            {id:2,weight:2.0},
            {id:4,weight:item_count[4] * 10.0},
            {id:3,weight:item_count[3] * 10.0},
            {id:5,weight:item_count[6] * 5.0},
            {id:8,weight:item_count[5] * 10.0},
            {id:12,weight:item_count[7] * 10.0},
            {id:9,weight:item_count[25] * 10.0},
            {id:7,weight:item_count[29] * 10.0},
        ]
        if(item_count[15] + item_count[12] + item_count[8] + item_count[1] == 0){
            weight_list.push(
                {id:26, weight:item_count[23] * 10.0}
            )
        }
        if(gameStartSeed == 0){
            throw "Error"
        }

        let currentSeed = gameStartSeed

        for(let item_i = 0;item_i < 0x1F;item_i++){
            for(let j=0;j<item_count[item_i];j++){
                currentSeed = RNG_Next(currentSeed, item_i)
            }
        }
        // console.log(currentSeed)
        let collectible_count = 733 // it equals to some_variable_a - some_variable_b
        
        let collectible_list = []
        for(let i=0;i<collectible_count;i++){
            collectible_list[i] = 0.0
        }

        let all_weight = 0.0
        // console.log(weight_list)
        if(weight_list.length > 0){
            for(let weight_select_i = 0;weight_select_i < weight_list.length;weight_select_i++){
                if(weight_list[weight_select_i].weight <= 0.0){
                    continue
                }
                let score = item_score_sum
                if(weight_list[weight_select_i].id == 4 || weight_list[weight_select_i].id == 3 || weight_list[weight_select_i].id == 5){
                    score -= 5
                }

                let quality_min = 0
                let quality_max = 1
                if ( score > 34 )
                {
                    quality_max = 4;
                    quality_min = 4;
                }
                else if ( score > 30 )
                {
                    quality_max = 4;
                    quality_min = 3;
                }
                else if ( score > 26 )
                {
                    quality_max = 4;
                    quality_min = 3;
                }
                else if ( score > 22 )
                {
                    quality_max = 4;
                    quality_min = 2;
                }
                else if ( score > 18 )
                {
                    quality_max = 3;
                    quality_min = 2;
                }
                else if ( score > 14 )
                {
                    quality_min = 1;
                    quality_max = 2;
                }else if ( score > 8 )
                {
                    quality_min = 0;
                    quality_max = 2;
                }
                
                let item_pools = GetItemPoolData(weight_list[weight_select_i].id)
                for(let item_pool_i = 0;item_pool_i < item_pools.length;item_pool_i++){
                    let item_config = undefined
                    if(item_pools[item_pool_i].id >= 0){
                        if(item_pools[item_pool_i].id >= collectible_count){
                            item_config = undefined
                        }else{
                            item_config = GetItemConfig(item_pools[item_pool_i].id)
                        }
                    }
                    let item_quality = 0 + item_config.quality /* there is not a zero, but a var from item_config, which is always zero when i'm testing */
                    if(item_quality >= quality_min && item_quality <= quality_max){
                        //be careful:the game use float instead of double, so js in not accurate!!!
                        let item_weight = item_pools[item_pool_i].weight * weight_list[weight_select_i].weight
                        all_weight += item_weight
                        // console.log(all_weight)
                        collectible_list[item_pools[item_pool_i].id] += item_weight
                    }
                }
            }
        }
        let retry_count = 0

        let selected
        let output = []
        while(true){
            currentSeed = RNG_Next(currentSeed,6)
            //use float instead!!!
            let remains = Number(currentSeed) * 2.3283062e-10 * all_weight
            // console.log(remains)
            selected = 25
            for(let current_select=0;current_select < collectible_count;current_select++){
                // console.log(collectible_list[current_select])
                if(collectible_list[current_select] > remains){
                    selected = current_select
                    break
                }
                remains -= collectible_list[current_select]
            }

            
            let item_config = GetItemConfig(selected)
            if(item_config != undefined
            ){
                if(
                    item_config.achievement_id == undefined ||
                    GetAchievementUnlocked(item_config.achievement_id)
                ){
                    //这个道具无需解锁
                    output.push(selected)
                    break
                }else{
                    //这个道具需要解锁，继续roll，给出下一个道具
                    output.push(selected)
                }
            }
            if(++retry_count >= 20)
                break
        }
        return output
    }
    
    //@debug-only
    {
        let input_array = [0x8,0x2,0x16,0xc,8,8,9,0xf] //[0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x1n]
        console.log(get_result(input_array, str2seed('JKD9 Z0C9')))    
    }
    
    // 灰机wiki相关

    let check_seed_reg = new RegExp("^[A-Z0-9]{4} [A-Z0-9]{4}$",'g')
    function CheckSeedString(seedstr){
        if(typeof(seedstr) != "string"){
            return false
        }
        if(seedstr.match(check_seed_reg))
            return true
        return false
    }
    
    function setup(crafting_div){
        let root = $(crafting_div)
        //种子输入框的span
        let crafting_seed_input_placeholder = root.find('#crafting_seed_input')
        if(crafting_seed_input_placeholder.length == 0){
            console.log("合成袋计算器未能成功加载，因为种子输入框的占位符没有找到")
            return
        }
        let invalid_seed_tip = root.find('#crafting_invalid_seed_tip')
        if(invalid_seed_tip.length == 0){
            console.log("合成袋计算器未能成功加载，因为无效种子提示框没有找到")
            return
        }
        // 袋子中的8个物品
        let recipe_placeholders = []
        for(let i=0;i<8;i++){
            let placeholder = root.find('#crafting_recipe_placeholder_'+i)
            if(placeholder.length == 0){
                console.log("合成袋计算器未能成功加载，因为袋中物品的占位符没有找到")
                return
            }
            recipe_placeholders[i] = placeholder
        }
        //滚动按钮
        let scroll_btn = root.find('#crafting_scroll_btn')
        if(scroll_btn.length == 0){
            console.log("合成袋计算器未能成功加载，因为滚动按钮没有找到")
            return
        }
        //重置按钮
        let reset_btn = root.find('#crafting_reset_btn')
        if(reset_btn.length == 0){
            console.log("合成袋计算器未能成功加载，因为重置按钮没有找到")
            return
        }
        // 输出结果的道具图像
        let item_preview = root.find('#collectible_placeholder')
        if(item_preview.length == 0){
            console.log("合成袋计算器未能成功加载，因为输出道具图像的占位符没有找到")
            return
        }
        //选择配方的列表
        let recipes = []
        let recipe_count = 29
        for(let i=1;i<=recipe_count;i++){
            let recipe = root.find('#crafting_recipe_'+i)
            if(recipe.length == 0){
                console.log("合成袋计算器未能成功加载，因为第"+i+"个配方按钮没有找到")
                return
            }
            recipes[i] = recipe
        }

        crafting_seed_input_placeholder.html("<input id='crafting_seed_input' class='mw-ui-input'>")

        let crafting_seed_input = crafting_seed_input_placeholder.find('#crafting_seed_input')
        if(crafting_seed_input.length == 0){
            console.log("合成袋计算器未能成功加载，种子输入框创建失败")
            return
        }

        let crafting_item_preview = root.find('#crafting_item_preview')
        if(crafting_item_preview.length == 0){
            console.log("合成袋计算器未能成功加载，因为道具预览位置没有找到")
            return
        }
        crafting_item_preview[0].style.setProperty('display','inline-block')
        crafting_item_preview.hide()

        let crafting_item_candidate_list = root.find('#crafting_item_candidate_list')
        if(crafting_item_candidate_list.length == 0){
            console.log("合成袋计算器未能成功加载，因为道具候选列表没有找到")
            return
        }
        crafting_item_candidate_list[0].style.setProperty('display','inline-block')
        crafting_item_candidate_list.hide()

        let crafting_item_candidate_list_elems = root.find('#crafting_item_cadidate_list_elems')
        if(crafting_item_candidate_list_elems.length == 0){
            console.log("合成袋计算器未能成功加载，因为道具候选列表元素没有找到")
            return
        }

        invalid_seed_tip[0].style.removeProperty('display')
        invalid_seed_tip.hide()

        let current_seed_number = 3333
        let seed_is_valid = true
        let items = [0,0,0,0,0,0,0,0]
        let output_ids = undefined

        //=====道具效果预览的两个变量======
        let CancelRequest = undefined
        let LastRequestTime = 0
                
        let current_display_items = ""
        function flush_ui(){
            //更新袋子中的8个物品图片
            for(let i=0;i<items.length;i++){
                let target = recipe_placeholders[i]
                for(let j=0;j<=recipe_count;j++){
                    target.removeClass('crafting_recipe_'+j)
                }
                target.addClass('crafting_recipe_'+items[i])
            }
            //显示道具图标
            if(output_ids == undefined || output_ids.length == 0){
                item_preview.attr("id","")
                item_preview[0].style.setProperty('cursor','')
                crafting_item_candidate_list.slideUp(100)
            }else{
                //设置第一个道具的输出图像
                let mid = output_ids[0]+""
                while(mid.length<3)
                    mid = '0' + mid
                item_preview.attr("id","collectibles_"+mid)
                item_preview[0].style.setProperty('cursor','pointer')
                //设置其它道具的输出图像，但是先检查一下需不需要更新，因为切换会有动画
                if(output_ids.join() != current_display_items){
                    current_display_items = output_ids.join()
                    crafting_item_candidate_list.slideUp(100,function(){
                        if(output_ids.length > 1){
                            crafting_item_candidate_list_elems.children().remove()
                            for(let i=0;i<output_ids.length;i++){
                                let div = document.createElement('div')
                                let id = output_ids[i]
                                let mid = id+""
                                
                                while(mid.length < 3)
                                    mid = '0' + mid
                                div.id = 'collectibles_'+mid
                                div.style = 'display:inline-block;width:32px;height:32px;image-rendering:pixelated;transform:scale(2);margin:16px;cursor:pointer;'
                                div.classList.add('collectibles')
                                //已经出现过了
                                if(output_ids.indexOf(id) < i)
                                    div.style.filter = 'blur(1px)'
                                div.onclick = function(){
                                    DisplayItemTemplateById(id)
                                }
                                crafting_item_candidate_list_elems[0].appendChild(div)
                            }
                            crafting_item_candidate_list.slideDown(300)
                        }
                    })
                }

            }
            if(seed_is_valid){
                invalid_seed_tip.fadeOut()
            }else{
                invalid_seed_tip.fadeIn()
            }
        }

        crafting_seed_input.val('JKD9 Z0C9')
        function calculate_seed(){
            seed_is_valid = false
            let seed_text = crafting_seed_input.val()
            if(CheckSeedString(seed_text))
            {
                let seed = str2seed(seed_text)
                if(seed != 0 && seed != undefined){
                    seed_is_valid = true
                    current_seed_number = seed
                }
            }
        }
        crafting_seed_input.on('change',function(){
            calculate_seed()
            calculate()
            flush_ui()
        })

        reset_btn.on('click',function(){
            items = [0,0,0,0,0,0,0,0]
            output_ids = undefined
            flush_ui()
            crafting_item_candidate_list.slideUp()
            current_display_items = ""
            if(CancelRequest)
                CancelRequest()
            crafting_item_preview.slideUp()
        })
        calculate_seed()

        scroll_btn.on('click',function(){
            if(items[1] == 0){
                //只有0个或1个元素，什么都不做
                return
            }
            if(items[7] == 0){
                //袋子没有满
                let i = 0
                let first = items[0]
                while(items[i+1]!=0){
                    items[i] = items[i+1]
                    i++
                }
                items[i]=first
                flush_ui()
            }else{
                items[7] = items.shift()
                flush_ui()    
            }
        })

        function calculate(){
            if(!seed_is_valid || items[7] == 0){
                output_ids = undefined
                return
            }
            try{
                output_ids = get_result(items,current_seed_number)
                //LastRequestTime = 0//重置道具预览的链接冷却限制
            }catch(e){
                output_ids = undefined
            }
        }

        for(let i=1;i<=recipe_count;i++){
            let index = i
            recipes[i].on('click',function(){
                let first_zero_index = 0
                while(first_zero_index < 8 && items[first_zero_index] != 0){
                    first_zero_index++
                }
                if(first_zero_index == 8){
                    items.shift()
                    items[7] = index
                }else{
                    items[first_zero_index] = index
                }
                calculate()
                flush_ui()
            })
        }

        //显示道具详情
        function DisplayItemTemplateById(id){
            //限制访问频率（已使用CDN缓存接口，界面上的请求频率限制为每0.5秒1次）
            if(new Date().getTime() - LastRequestTime < 500){
                return
            }
            LastRequestTime = new Date().getTime()
            let canceled = false
            if(CancelRequest){
                CancelRequest()
            }
            crafting_item_preview.slideUp(50,function(){
                crafting_item_preview.text('正在准备数据...')
                $.get('https://cdn.huijiwiki.com/'+mw.config.get('wgHuijiPrefix')+'/api.php',{
                    action:'parse',
                    title:mw.config.get('wgPageName'), 
                    text:"{{Crafting/道具预览|"+id+"}}",
                    contentmodel:'wikitext',
                    format:'json',
                    _i:'day_'+Math.floor(((new Date().getTime()/1000/60/60)/24) - (4/24)/* 凌晨4点刷新缓存，避开午夜高峰期 */) // cache every day
                }).done(function(data){
                    if(canceled)
                        return
                    CancelRequest = undefined
                    crafting_item_preview.slideUp(100,function(){
                        try{
                            crafting_item_preview.html(data.parse.text['*'])
                        }catch(e){
                            crafting_item_preview.text("nooooooooooooo,数据错误")
                            console.log("合成袋计算器发生了数据格式的错误")
                            console.log(data)
                        }
                        crafting_item_preview.slideDown()    
                    })
                }).fail(function(){
                    if(canceled)
                        return
                    CancelRequest = undefined
                    crafting_item_preview.slideUp(300,function(){
                        let tiparr = [
                            "是……Maze诅咒！",
                            "哎嘿，没网了",
                            "啊啊啊a，掉线le",
                            "只有聪明人才看得到的结果，括号是骗人的",
                            `冷知识：飞行模式虽然不能让${mw.config.get('wgUserName') || '你'}起飞，但是可以掉线`,
                            `此时的互联网，可望不可即，折磨着${mw.config.get('wgUserName') || '你'}那进取的心`,
                            "？？？",
                        ]
                        crafting_item_preview.text(tiparr[Math.floor(Math.random() * tiparr.length)] + "\n（道具数据请求失败，请检查网络后再次尝试）")
                        crafting_item_preview.slideDown()
                    })
                })
                crafting_item_preview.slideDown(50)
            })
            CancelRequest = function(){
                CancelRequest = undefined
                canceled = true
            }
        }

        item_preview.on('click',function(){
            if(output_ids != undefined && output_ids.length > 0){
                DisplayItemTemplateById(output_ids[0])
            }
        })
    }

    let crafting_templates = $('.crafting_template')
    for(let i=0;i<crafting_templates.length;i++){
        setup(crafting_templates[i])
    }

})(jQuery)