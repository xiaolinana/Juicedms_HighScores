
'use client';

import { Inter } from '@next/font/google'
import styles from './page.module.css'
import {useEffect, useState} from "react";
import {getLocalStorage} from "@/src/utils/storage";
import Block from "@/src/components/block";

const inter = Inter({ subsets: ['latin'] })

const NEW_RECORD = 'new-record'

export default function Home() {
    const [newRecord, setNewRecord] = useState(0);
    const [blocks, setBlocks] = useState(Array.from(Array(16).keys()));

    useEffect(() => {