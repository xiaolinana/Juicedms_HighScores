import React, {useEffect, useState} from 'react';
import styles from "@/app/page.module.css";
import {usePrevProps} from "@/src/hooks/use-prev-props";
import {useBoard} from "@/src/contexts/board";
import invariant from "tiny-invariant";

interface BlockProps {
    value: number
