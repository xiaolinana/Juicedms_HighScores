import React, {useEffect, useState} from 'react';
import styles from "@/app/page.module.css";
import {usePrevProps} from "@/src/hooks/use-prev-props";
import {useBoard} from "@/src/contexts/board";
import invariant from "tiny-invariant";

interface BlockProps {
    value: number
    position: [number, number]
}

const Block = ({ value, position }: BlockProps) => {
    const [scale, setScale] = useState(1);
    const [containerWidth, tileCount] = useBoard();

    const prevValue = usePrevProps<number>(value);

    const isNew = prevValue === undefined;
    const hasChanged = prevValue !== value;
    const shallAnimate = isNew |