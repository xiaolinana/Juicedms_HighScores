
import {BlockType} from "@/src/types/block";

type State = {
    tiles: {
        [id: string]: BlockType;
    };
    inMotion: boolean;
    hasChanged: boolean;
    byIds: string[];