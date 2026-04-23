import { Star } from 'lucide-react';
import React from 'react'

interface TestinomialProps {
  rating: number;
  comment: string;
  avatar: string;
  location: string;
  name: string;
}

 const Testinomial = ({
   rating,
   comment,
   avatar,
   name,
   location,
 }: TestinomialProps) => {
   return (
     <div className="mx-2 min-h-[260px] w-[350px] shrink-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
       <div className="mb-4 flex gap-1">
         {[...Array(5)].map((_, i) => (
           <Star
             key={i}
             className={`h-4 w-4 ${
               i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
             }`}
           />
         ))}
       </div>

       <p className="line-clamp-5 text-sm leading-7 text-gray-600">
         "{comment}"
       </p>

       <div className="mt-6 flex items-center gap-3 border-t pt-4">
         <img
           src={avatar}
           alt={name}
           className="h-12 w-12 rounded-full object-cover"
         />

         <div>
           <h4 className="font-semibold text-gray-800">{name}</h4>
           <p className="text-sm text-gray-500">{location}</p>
         </div>
       </div>
     </div>
   );
 };


export default Testinomial;