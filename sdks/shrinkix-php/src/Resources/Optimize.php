<?php

namespace Shrinkix\Resources;

use Shrinkix\Transport;

/**
 * Optimize Resource
 */
class Optimize
{
    private Transport $transport;

    public function __construct(Transport $transport)
    {
        $this->transport = $transport;
    }

    public function optimize(
        $file,
        ?array $resize = null,
        ?array $crop = null,
        ?string $format = null,
        ?int $quality = null,
        ?string $metadata = null
    ): array {
        $multipart = [
            [
                'name' => 'image',
                'contents' => is_string($file) ? fopen($file, 'r') : $file,
            ],
        ];

        if ($resize !== null) {
            $multipart[] = [
                'name' => 'resize',
                'contents' => json_encode($resize),
            ];
        }

        if ($crop !== null) {
            $multipart[] = [
                'name' => 'crop',
                'contents' => json_encode($crop),
            ];
        }

        if ($format !== null) {
            $multipart[] = [
                'name' => 'format',
                'contents' => $format,
            ];
        }

        if ($quality !== null) {
            $multipart[] = [
                'name' => 'quality',
                'contents' => (string)$quality,
            ];
        }

        if ($metadata !== null) {
            $multipart[] = [
                'name' => 'metadata',
                'contents' => $metadata,
            ];
        }

        $result = $this->transport->post('/optimize', [
            'multipart' => $multipart,
        ]);

        return [
            'data' => $result['data'],
            'rate_limit' => $result['rate_limit'],
            'request_id' => $result['rate_limit']['request_id'],
        ];
    }
}
