import type { Publisher, PublishRequest, PublishResult } from "./Publisher.ts";
import { renderPostText } from "./Publisher.ts";

/**
 * Faz 1 yayıncısı: API ile paylaşmaz, kullanıcının LinkedIn'e elle yapıştıracağı
 * temiz, biçimlenmiş metni döner. LinkedIn onayı/uygulaması beklenirken çalışır.
 */
export class CopyPastePublisher implements Publisher {
  readonly platform = "manual";

  async publish(req: PublishRequest): Promise<PublishResult> {
    return {
      platform: this.platform,
      status: "manual",
      externalPostId: null,
      text: renderPostText(req.draft),
    };
  }
}
