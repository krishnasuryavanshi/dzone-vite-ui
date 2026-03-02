import { ID_PREFIX, UI } from '../constants';

export const generateMessageId = (): string =>
  `${ID_PREFIX.MESSAGE}${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 2 + UI.RANDOM_ID_LENGTH)}`;

export const generateConversationId = (): string =>
  `${ID_PREFIX.CONVERSATION}${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 2 + UI.RANDOM_ID_LENGTH)}`;

export const generateTempFileId = (): string =>
  `${ID_PREFIX.TEMP_FILE}${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 2 + UI.RANDOM_ID_LENGTH)}`;

export const generateConnectionId = (): string =>
  `${ID_PREFIX.CONNECTION}${Date.now()}`;
