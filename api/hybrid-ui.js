export default async function handler(req,res){
  // Kept as a lightweight marker endpoint for the hybrid branch.
  // The actual UI assets are static and can be linked from index.html when merged.
  res.status(200).json({name:'stitch-hybrid-ui',version:4,status:'ready'});
}
