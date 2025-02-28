// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// export default function OfferModal() {
//   const [open, setOpen] = useState(true);

//   return (
//     <Dialog open={open} onOpenChange={(isOpen: boolean) => setOpen(isOpen)}>
//       <DialogContent className="max-w-md text-center">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">Special Offer!</DialogTitle>
//         </DialogHeader>
//         <p className="text-lg">
//           You get <span className="font-bold text-red-500">50% off</span> on the export. Grab it now!
//         </p>
//         <Button className="w-full mt-4" onClick={() => setOpen(false)}>
//           Claim Offer
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// }