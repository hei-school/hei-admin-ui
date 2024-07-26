import {
  FileInfo,
  FileType,
  ProfessionalExperienceFileTypeEnum,
  WorkDocumentInfo,
} from "@haapi/typescript-client";

export const newDoc: FileInfo = {
  id: "new_doc1_id",
  name: "new_document",
  creation_datetime: new Date("2024-05-08"),
  file_type: FileType.DOCUMENT,
  file_url:
    "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
};

export const newTranscript: FileInfo = {
  id: "new_transcript1_id",
  name: "new_document",
  creation_datetime: new Date("2024-05-08"),
  file_type: FileType.TRANSCRIPT,
  file_url:
    "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
};

export const transcriptsMock: FileInfo[] = [
  {
    id: "doc5_id",
    name: "document_5",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.TRANSCRIPT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc6_id",
    name: "document_6",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.TRANSCRIPT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc7_id",
    name: "document_7",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.TRANSCRIPT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc8_id",
    name: "document_8",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.TRANSCRIPT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
];

export const transcript1: FileInfo = transcriptsMock[0];

export const workDocsMocks: WorkDocumentInfo[] = [
  {
    id: "doc9_id",
    name: "document_9",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.WORK_DOCUMENT,
    professional_experience: ProfessionalExperienceFileTypeEnum.WORKER_STUDENT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc10_id",
    name: "document_10",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.WORK_DOCUMENT,
    professional_experience: ProfessionalExperienceFileTypeEnum.WORKER_STUDENT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc11_id",
    name: "document_11",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.WORK_DOCUMENT,
    professional_experience: ProfessionalExperienceFileTypeEnum.WORKER_STUDENT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc12_id",
    name: "document_12",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.WORK_DOCUMENT,
    professional_experience: ProfessionalExperienceFileTypeEnum.WORKER_STUDENT,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
];

export const workDoc1: WorkDocumentInfo = workDocsMocks[0];

export const newWorkerDoc: WorkDocumentInfo = {
  id: "new_workdoc1_id",
  name: "new_document",
  creation_datetime: new Date("2024-05-08"),
  file_type: FileType.WORK_DOCUMENT,
  professional_experience: ProfessionalExperienceFileTypeEnum.WORKER_STUDENT,
  file_url:
    "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
};

export const otherDocsMocks: FileInfo[] = [
  {
    id: "doc13_id",
    name: "document_13",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.OTHER,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc13_id",
    name: "document_13",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.OTHER,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc13_id",
    name: "document_13",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.OTHER,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
  {
    id: "doc13_id",
    name: "document_13",
    creation_datetime: new Date("2024-05-08"),
    file_type: FileType.OTHER,
    file_url:
      "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
  },
];

export const otherDoc1: FileInfo = otherDocsMocks[0];

export const newOtherrDoc: FileInfo = {
  id: "new_other1_id",
  name: "new_document",
  creation_datetime: new Date("2024-05-08"),
  file_type: FileType.OTHER,
  file_url:
    "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/SCHOOL_FILE%3Atest.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIHVP%2Fl%2BSnAqhjeyUp9B1%2BsunEWAFjs8Jer0e%2BEiwOX0cAiEA2l6FLMAsiSaZflgN7DOjdSi5UneLjDJ%2Ft1Qfu5eKIgQquQMIKRAAGgwwNTcwNDU3ODUxODkiDESPv3FBIvVGd8IXLSqWA7S3qsLBhQ3Gr5QBUhjisZP1acA0Bb6Skq4%2F8EM28TxkxeBeVuAYce50GOcdmkR05YkU1H1SpH2C3jbioaxwhicv4t6yBBOX1uCcExuSeVvFDucACIJM5EF%2BCB8sf7%2FVV9MrtyYBnpAcYH%2Fkr%2FHmWfTTT5VEQHLDErX1sHEwjajSJyM1uCtasf9M5X3B7FYfgld2pyS%2B8pJRc8CBckQX9J5yP3iwpbIG7fJdBiUyGjwESgMV0xdwxADc4fgwCbBpozb4K%2B48u3VK9sBEiVNv%2FLk056f4FZDnySGtnT7wvNaJCEiMV%2FOgI5dxvqe7eSuUUlBZjBA3gI1T5ltHOT0S9H%2FsAWrw328TRxzuOfB4rlt91X32u03zkHUZh25cOWE3WuJQPWeUKHCel9Q%2FmARUBYONmRbTQ98k9U5%2BqA5W1VCSZJZ0byv%2BnkH%2BVfz1tV%2FwBzKQ%2BFHJIZC50VPTjkPZv7RbZ%2FY3t6gALdxiTwEmalQJwSc5duQJVBfI4iW2Zyc0hG2dGMJ7xiCx%2ByqCy9MpfXyIPjk%2FWEkwzOjgsgY6ngFRjtg26iOjASmuiHHO%2BiEquyWijUM8sez%2F7jh96VxJOEfgg%2BEX6BI6qZMgPwJwvN35%2BH29LQVUbbNJoISdaml4XSJYgsi7vrHKjZts9X5hbi8tcLOlT0k9ZGccSwMKiKRAGDgbpoW%2BNxLKZk3ZUUih2iUoR6A1gaH2GDtBTZAz%2BoeItRMkj76XoacI%2BiKwNgifXRA6HwZzh6ZPQx1mgQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240530T081935Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJSWKQUPQS7%2F20240530%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=2fe6568dfe1cb5db7c9a528fe88f51a1c94cc27868c2ee1e44888aab866d5bae",
};
