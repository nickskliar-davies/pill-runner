'use client'

import React from "react";
import Image from "next/image";
import { useState } from 'react';
import styles from "./page.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {  scriptLocationExtended } from "./consts";

const externalArray: string[] = [];
let scriptHasRun = false;
let timerStart = false;
let lastFetched = '';
export default function PillRunner() {
  const [code, setCode] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);      
  const [error, setError] = useState(false);
  const [mdError, setMdError] = useState(false);
  const [activeScript, setActiveScript] = useState(scriptLocationExtended[0]);    

  if (activeScript.scriptSource && lastFetched != activeScript.url){
    scriptHasRun = false;
    fetch(`${activeScript.url}${activeScript.scriptSource}`)
      .then((result) => {
        result.text().then(x => {
          lastFetched = activeScript.url;
          setCode(x);
          runScript(x);
          setError(false);
        });
      }).catch((error) => {
        console.error(error);
        setError(true);
      });
  }

  if (activeScript.mdSource && activeScript.url != lastFetched){
    fetch(`${activeScript.url}${activeScript.mdSource}`)
      .then((result => {
        result.text().then(x => {
          lastFetched = activeScript.url;
          const mdList = x.split('---');
          mdList.shift();
          mdList.shift();
          const mdText = mdList.join('---');
          setMarkdown(mdText);
          setMdError(false);
        });
      })).catch((error) => {
        console.error(error);
        setError(true);
      });
  }  

  function runScript(scriptCode: string){        
    if (!scriptHasRun){
      externalArray.length = 0;
      scriptHasRun = true;         
      eval(scriptCode)     
      console.info('setResult triggering render loop');      
      console.info(externalArray);
      setResult([...externalArray]);
    }        
  }  

  console.log = (...args) => {
    let logStatement = '';
    console.info(...args);
    args.forEach(arg => {
      
      logStatement += JSON.stringify(arg);
    });    
    
    externalArray.push(logStatement);             
  };  

  if (!timerStart){
    // Allows for console capturing after the fact for async operations.
    timerStart = true;
    setInterval(() => {      
      setResult([...externalArray]);
    }, 1000);
  }
  
  return (
    <main className={styles.main}>      
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
          <h1>Pill Runner</h1>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.navbar}>
          <ul>
            {scriptLocationExtended.map((info, index) => (
              <li key={`loc-${index}`}>
                <button onClick={(e) => setActiveScript(info)}>{info.name}</button>
              </li>
            ))}
          </ul>
          
        </div>
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
          {!!activeScript.scriptSource && 
            <React.Fragment>
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
            </React.Fragment>
          }                                       
        </div>
      </div>
    </main>
  );
}
