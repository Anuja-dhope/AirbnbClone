// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const Review=require("./review.js");
// const listingSchema=new Schema(
//     {
//         title:{
//             type:String,
//             required:true,
//         },
//         description:{
//             type:String,
//         },
//         image: {
//   type: {
//     filename: String,
//     url: {
//       type: String,
//       default: "https://images.unsplash.com/photo-1736618625357-2a7f197f8c23?...",
//       set: v => v === "" ? undefined : v
//     }
//   },
//   default: undefined
// },
//         price:{
//             type:Number,
//         },
//         location:{
//             type:String,
//         },
//         country:{
//             type:String,
//         },
//         reviews:[{
//             type:Schema.Types.ObjectId,
//             ref:"Review"
//         }],
//         owner: [{
//   type: Schema.Types.ObjectId,
//   ref: "User"
// }]
//     }
// )

// //middleware to delete all review when that listing is deleted
// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
//         await Review.deleteMany({_id:{$in:listing.reviews}});
//     }
// });

// const Listing=mongoose.model("Listing",listingSchema);
// module.exports =Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1736618625357-2a7f197f8c23",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// DELETE REVIEWS WHEN LISTING DELETED
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
