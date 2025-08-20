import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAttachmentDto {
    @IsNotEmpty()
    @IsNumber()
    entity_id: number;
    
    @IsNotEmpty()
    @IsString()
    url: string;
    type: 'image' | 'video';
    size: number;
}
/**
 ### **Attachment**

- attachment_id (PK)
- entity_id (FK → Entity.entity_id)
- url
- type (image/video)
- size (bytes)
- created_at
- updated_at
 */