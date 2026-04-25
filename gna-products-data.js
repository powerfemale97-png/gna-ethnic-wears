// ══════════════════════════════════════════════════════════════
//  GnA Ethnic Wears — Product Data File
//  Generated: 25/04/2026, 3:03:47 pm
//  Products: 1
//  HOW TO USE:
//    1. Replace the existing gna-products-data.js in your website folder
//    2. Re-upload to your web host (Netlify / cPanel / etc.)
//    3. Refresh any collection page — products appear instantly!
// ══════════════════════════════════════════════════════════════

var GNA_PRODUCTS_DATA = [
  {
    "id": "p1777092779838",
    "name": "Phulwari Coord Set",
    "collection": "Cord Set",
    "price": 29.99,
    "oldPrice": null,
    "desc": "Inspired by the beauty of a blooming flower garden, the Phulwari Coord Set features a soft cream khadi cotton short kurti with a delicate mandarin collar and button detailing, paired with matching straight-leg pants. The vibrant hand-printed botanical motifs in pink, green and yellow bring this effortless two-piece set to life. Light, breathable and beautifully crafted — perfect for brunches, casual outings, or festive gatherings.",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "sizeQty": {
      "M": 1,
      "L": 1,
      "XL": 1
    },
    "colors": [
      {
        "hex": "#f5ebd7",
        "name": "Khadi Cotton"
      }
    ],
    "variants": "[{\"hex\":\"#f5ebd7\",\"name\":\"Khadi Cotton\",\"sizes\":{\"M\":1,\"L\":1,\"XL\":1},\"sizeList\":[\"M\",\"L\",\"XL\"]}]",
    "weight": 250,
    "badge": "New",
    "emoji": "🌸",
    "bg": "linear-gradient(155deg,#4A148C,#1A0050)",
    "cat": "Cord Set",
    "category": "Cord Set",
    "photoUrl": "https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092180/xbmbbvvwnquzkycozbqt.png",
    "photoData": null,
    "photos": "[\"https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092180/xbmbbvvwnquzkycozbqt.png\",\"https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092177/wwicvtcpugpbtjqqix8b.png\",\"https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092180/cjcvjkollwvvloa9p4r8.png\",\"https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092182/szi8hbbgok0cwmtjmlvb.png\",\"https://res.cloudinary.com/dwbwldr1p/image/upload/v1777092178/xxllnyypp9sezu2dnoik.png\"]",
    "videoUrl": "",
    "dateAdded": "25/04/2026"
  }
];

// Auto-seed all collection pages via localStorage
(function(){
  try{
    var existing=[];
    try{existing=JSON.parse(localStorage.getItem("gna_products")||"[]");}catch(e){}
    var merged=existing.slice();
    GNA_PRODUCTS_DATA.forEach(function(p){
      var idx=-1;
      for(var i=0;i<merged.length;i++){if(merged[i].id===p.id){idx=i;break;}}
      if(idx>=0) merged[idx]=p; else merged.push(p);
    });
    localStorage.setItem("gna_products",JSON.stringify(merged));
    console.log("[GnA] "+merged.length+" products loaded.");
  }catch(e){console.warn("[GnA] Could not seed product data:",e);}
})();
