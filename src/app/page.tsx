'use client'

import React from "react";
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

let lastFetched = '';
export default function PillRunner() {
  const [code, setCode] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);    
  const [scriptIndex, setScriptIndex] = useState<number>(0);
  const [error, setError] = useState(false);
  const [mdError, setMdError] = useState(false);
  
  if (scriptLocations[scriptIndex] != lastFetched){
    fetch(`${scriptLocations[scriptIndex]}index.js`)
    .then(
      (result) => {
        if (result.ok){
          result.text().then(x => {                    
            setError(false);
            console.info('setCode triggering render loop');
            setCode(x);
            runScript(x);
          });
        } else {
          console.error(result.statusText);
          setError(true);
        }        
      })
    .catch((error) => {
      console.error(error);
      setError(true);
    });
  
    fetch(`${scriptLocations[scriptIndex]}README.md`)
    .then(
      (result) => {
        if (result.ok){
          result.text().then(x => {                    
            setMdError(false);
            const mdList = x.split('---');
            mdList.shift();
            mdList.shift();
            const mdText = mdList.join('---');
            console.info('setMarkdown triggering render loop');
            setMarkdown(mdText);          
          });
        } else {
          setMdError(true);
        }        
      })
    .catch((error) => {
      console.error(error);
      setMdError(true);
    });
    lastFetched = `${scriptLocations[scriptIndex]}`;
  }
  

  function runScript(scriptCode: string){    
    externalArray.length = 0;
    if (!scriptHasRun){
      scriptHasRun = true;         
      eval(scriptCode)     
      console.info('setResult triggering render loop');      
      setResult([...externalArray]);
    }    
    
  }  

  console.log = (...args) => {
    let logStatement = ''
    args.forEach(arg => {
      logStatement += `${arg},`;
    });    
    
    externalArray.push(logStatement);         
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
          console.info('setScriptIndex triggering render loop');
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
          <React.Fragment>
            <SyntaxHighlighter language="javascript">
                {code}
            </SyntaxHighlighter>  
            <div>
              {result.map((val: string, index: number) => (
                <p className={styles.codeline} key={`val-${index}`}>{val}</p>
              ))}                        
            </div>      
          </React.Fragment>                    
          }    
        
            
         
        </div>
      </div>
                    
      

      
    </main>
  );
}
