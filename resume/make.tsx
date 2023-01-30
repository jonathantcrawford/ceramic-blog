import * as React from "react";
import { renderToString } from "react-dom/server";
import { ResumeTemplate } from "~/components/Resume/Resume";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as fs from "fs";
import { JSDOM } from "jsdom";
import htmlToPdfMake from "html-to-pdfmake";



const { window } = new JSDOM("");

  
const htmlString = renderToString(<ResumeTemplate pdfMake/>)



const html = htmlToPdfMake(htmlString, { 
  window,
  defaultStyles: {}
});


const docDefinition = {
  content: [
    html
  ]
};

console.log(JSON.stringify(docDefinition, null, 2));


var pdfDocGenerator = pdfMake.createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs);
pdfDocGenerator.getBuffer(function(buffer) {
  fs.writeFileSync('./public/jonathan_t_crawford_resume.pdf', buffer);
});