'use client'

import Image from "next/image";
import { useState } from 'react';
import styles from "./page.module.css";

const scriptLocations = ["./pills/arbitraryconsolelog.js"
  ,"./pills/Array.prototype.every/index.js"
  ,"./pills/async-await-iterations/index.js"
  ,"./pills/check-conditions/index.js"
  ,"./pills/check-variables-with-and-operator/index.js"
  ,"./pills/clone-objects/index.js"
  ,"./pills/compose/index.js"
  ,"./pills/console-explained/index.js"
  ,"./pills/currying/index.js"
  ,"./pills/dedupe-arrays/index.js"
  ,"./pills/DefaultValues/index.js"
  ,"./pills/falsy-values/index.js"
  ,"./pills/in-operator/index.js"
  ,"./pills/map/index.js"
  ,"./pills/merging-arrays/index.js"
  ,"./pills/prevent-prototype-pollution/index.js"
  ,"./pills/reduce/index.js"
  ,"./pills/regular-expressions/index.js"
  ,"./pills/replaceAll/index.js"
  ,"./pills/semicolon-usage/index.js"
  ,"./pills/short-circuit-conditionals/index.js"
  ,"./pills/shuffle-array-elements/index.js"
  ,"./pills/using-!!operator/index.js"  
];
const externalArray: string[] = [];
let scriptHasRun = false;
let error = false;
export default function PillRunner() {
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);  
  const [pillScript, setPillScript] = useState<string>('');  
  const [scriptIndex, setScriptIndex] = useState<number>(0);
  
  if (pillScript == scriptLocations[scriptIndex]){
    fetch(pillScript)
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
  }  
  else {
    setPillScript(scriptLocations[scriptIndex]);
  }

  function runScript(scriptCode: string){    
    externalArray.length = 0;
    if (!scriptHasRun){
      scriptHasRun = true;
      setResult([]);        
      setTimeout(() => eval(scriptCode), 1000);    
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
          }}>Result</button>  
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
      {error ? 
        <div className={styles.center}>
          <span>
            An error has occurred retrieving the pill script. This may not have been provided.
          </span>
        </div>
       : 
        <div className={styles.center}>
          <pre>{code}</pre>        
        </div>      
        }            
        <div>   
        <div className={styles.center}>
            
          <div>
          {result.map((val: string, index: number) => (
            <p key={`val-${index}`}>{val}</p>
          ))}                        
          </div>  
        
        </div>                
      </div>

      
    </main>
  );
}
