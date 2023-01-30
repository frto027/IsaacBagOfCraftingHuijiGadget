//此脚本读取out/datas.js的数据，并转换后输出到out/compressed.json文件中

var {item_pool_data, item_config_data, active_item_ids} = require('./out/datas')

let item_pool_data_compressed = []
let id_with_achievement = []
for(let i in item_pool_data){
    let data = item_pool_data[i]
    let data_compressed = {}

    for(data_item of data){
        if(data_compressed[Number(data_item.weight)] == undefined)
            data_compressed[Number(data_item.weight)] = []
        data_compressed[Number(data_item.weight)].push(data_item.id)
    }

    item_pool_data_compressed[Number(i)] = data_compressed
}

let item_config_data_compressed = {}

let id_with_tags = {
    "lazarusshared":[],
    "nodaily":[],
    "offensive":[],
    "nolostbr":[],
    "nokeeper":[],
    "nogreed":[],
    "nochallenge":[],
    // "nocantrip":[],
}
for(let id in item_config_data){
    let quality = item_config_data[id].quality
    if(item_config_data_compressed[quality] == undefined)
        item_config_data_compressed[quality] = []
    item_config_data_compressed[quality].push(Number(id))

    let aid = item_config_data[id].achievement_id
    if(aid && aid > 0){
        id_with_achievement.push(Number(id))
    }

    let tags_string = item_config_data[id].tags
    if(tags_string){
        for(let tag of tags_string.split(" ")){
            if(id_with_tags[tag]){
                id_with_tags[tag].push(Number(id))
            }
        }
    }
}

let compressed = JSON.stringify({
    item_pool_data_compressed:item_pool_data_compressed,
    item_config_data_compressed:item_config_data_compressed,
    id_with_achievement:id_with_achievement,
    id_with_tags:id_with_tags,
    active_item_ids:active_item_ids,
})

require('fs').writeFileSync("out/compressed.json",compressed)