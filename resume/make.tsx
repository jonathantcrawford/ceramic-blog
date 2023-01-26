import * as React from "react";
import { renderToString } from "react-dom/server";
import { ResumeTemplate } from "~/components/Resume/Resume";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as fs from "fs";
import { JSDOM } from "jsdom";
import htmlToPdfMake from "html-to-pdfmake";



const { window } = new JSDOM("");

  
const htmlString = renderToString(<ResumeTemplate includeHeader/>)



const html = htmlToPdfMake(htmlString, { 
  window,
  defaultStyles: {
    h1: {
      marginBottom: 10,
      fontSize: 18
    },
    h2: {
      marginBottom: 10,
      fontSize: 16
    },
    h3: {
      marginBottom: 10,
      fontSize: 14
    },
    li: {
      fontSize: 12
    },
    section: {
      marginBottom: 200,
    }
  }
});


const docDefinition = {
  content: [
    html
  ]
};


var pdfDocGenerator = pdfMake.createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs);
pdfDocGenerator.getBuffer(function(buffer) {
  fs.writeFileSync('./public/resume.pdf', buffer);
});