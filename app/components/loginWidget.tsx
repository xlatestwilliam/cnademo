'use client'

import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import { Widget } from '@xsolla/login-sdk';
import { useEffect } from 'react';

export default function Home() {

  const searchParams = useSearchParams()
  const tokenParam = searchParams.get('token')

  const urlParams: URLSearchParams | undefined = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
  const tokenParamTrad = urlParams?.get('token');

  useEffect(() => {
    if (typeof window !== 'undefined'){
      const xl = new Widget({
        callbackUrl: 'https://test-370.xsollasitebuilder.com/',
        projectId: '8fd9bf2f-ec9a-11ec-b9f0-42010aa80004',
        preferredLocale: 'en_US'
      });
      xl.mount('widget');
    }
  },[])

  return (
    <div id="widget" style={{height:'100vh'}}></div>
  )
}
