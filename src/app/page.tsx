'use client'

import Script from 'next/script';
import Image from "next/image";
import { useState } from 'react';
import styles from "./page.module.css";

const scriptLocation = "./pills/arbitraryconsolelog.js";

export default function PillRunner() {
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [pillScript, setPillScript] = useState<string>('');  
  
  
  if (pillScript){
    fetch(pillScript)
    .then(
      (result) => 
        result.text().then(x => setCode(x)))
    .catch((error) => console.error(error));
  }  
  else {
    setPillScript(scriptLocation);
  }

  console.log = (...args) => {
    let logStatement = ''
    args.forEach(arg => {
      logStatement += `${arg},`;
    });    

    setResult([...result, logStatement]);    
    console.warn(logStatement);    
    console.warn(result);
  };  

  return (
    <main className={styles.main}>
      <button onClick={(e) => {          
          
          setPillScript("");
          setPillScript(scriptLocation);
          }}>Result</button>
      <div className={styles.description}>
        <div>
          <a
            href="https://www.one-beyond.com/"
            target="_blank"
            rel="noopener noreferrer"
          >            
            <Image
              src="/logo-2023-animated@1x.webp"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={210}
              height={82}
              priority
            />
          </a>
        </div>
      </div>
      <div className={styles.center}>
        <pre>{code}</pre>
        <Script src={scriptLocation} strategy="lazyOnload" />
      </div>
      
      
      <div className={styles.center}>
        
        <div>        
        {result.map((val: string, index: number) => (
            <p key={`val-${index}`}>{val}</p>
        ))}                
        </div>                
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>      
    </main>
  );
}
