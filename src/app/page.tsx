'use client'

import Image from "next/image";
import { useState } from 'react';
import styles from "./page.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from 'react-syntax-highlighter';

const scriptLocations = ["./pills/Array.prototype.every/"
  ,"./pills/async-await-iterations/"
  ,"./pills/check-conditions/"
  ,"./pills/check-variables-with-and-operator/"
  ,"./pills/clone-objects/"
  ,"./pills/compose/"
  ,"./pills/console-explained/"
  ,"./pills/currying/"
  ,"./pills/dedupe-arrays/"
  ,"./pills/DefaultValues/"
  ,"./pills/falsy-values/"
  ,"./pills/in-operator/"
  ,"./pills/map/"
  ,"./pills/merging-arrays/"
  ,"./pills/prevent-prototype-pollution/"
  ,"./pills/reduce/"
  ,"./pills/regular-expressions/"
  ,"./pills/replaceAll/"
  ,"./pills/semicolon-usage/"
  ,"./pills/short-circuit-conditionals/"
  ,"./pills/shuffle-array-elements/"
  ,"./pills/using-!!operator/"  
];
const externalArray: string[] = [];
let scriptHasRun = false;
let error = false;
let mdError = false;

export default function PillRunner() {
  const [code, setCode] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);    
  const [scriptIndex, setScriptIndex] = useState<number>(0);
  
  fetch(`${scriptLocations[scriptIndex]}index.js`)
  .then(
    (result) => {
      if (result.ok){
        result.text().then(x => {                    
          error = false;
          setCode(x);
          runScript(x);
        });
      } else {
        error = true;
      }        
    })
  .catch((error) => console.error(error));

  fetch(`${scriptLocations[scriptIndex]}README.md`)
  .then(
    (result) => {
      if (result.ok){
        result.text().then(x => {                    
          mdError = false;
          const mdList = x.split('---');
          mdList.shift();
          mdList.shift();
          const mdText = mdList.join('---');

          setMarkdown(mdText);          
        });
      } else {
        mdError = true;
      }        
    })
  .catch((error) => console.error(error));


  function runScript(scriptCode: string){    
    externalArray.length = 0;
    if (!scriptHasRun){
      scriptHasRun = true;
      setResult([]);   
      eval(scriptCode)           
    }    
  }  

  console.log = (...args) => {
    let logStatement = ''
    args.forEach(arg => {
      logStatement += `${arg},`;
    });    
    
    externalArray.push(logStatement);
    setResult([...externalArray]);        
    console.info(...args);
  };  

  return (
    <main className={styles.main}>
      <button onClick={(e) => {     
          let index = scriptIndex;        
          if (scriptIndex < scriptLocations.length - 1){
            index ++;
          } else {
            index = 0;
          }
          console.info(`${index} index of scripts`);
          scriptHasRun = false;
          setScriptIndex(index);               
          }}>Next Pill</button>  
      <div className={styles.description}>
        <div>
          <a
            href="https://www.one-beyond.com/"
            target="_blank"
            rel="noopener noreferrer"
          >            
            <Image
              unoptimized
              src="/logo-2023-animated@1x.webp"
              alt="One Beyond Logo"
              className={styles.vercelLogo}
              width={210}
              height={82}
              priority
            />
          </a>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.markdown}>
        {mdError ?
          <div>
            An error has occurred retrieving the markdown. This may not have been provided.
          </div>
          :
          <div>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </div>
        } 
        </div>
        <div>
              
          {error ?         
            <span>
              An error has occurred retrieving the pill script. This may not have been provided.
            </span>        
          : 
            <SyntaxHighlighter language="javascript">
              {code}
            </SyntaxHighlighter>                          
          }    
        
            
        <div>
          {result.map((val: string, index: number) => (
            <p className={styles.codeline} key={`val-${index}`}>{val}</p>
          ))}                        
        </div>   
        </div>
      </div>
                    
      

      
    </main>
  );
}
