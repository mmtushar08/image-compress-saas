<?php

namespace Shrinkix\Resources;

use Shrinkix\Transport;

/**
 * Usage Resource
 */
class Usage
{
    private Transport $transport;

    public function __construct(Transport $transport)
    {
        $this->transport = $transport;
    }

    public function getStats(): array
    {
        $result = $this->transport->get('/usage/stats');
        return array_merge($result['data'], ['rate_limit' => $result['rate_limit']]);
    }
}

/**
 * Limits Resource
 */
class Limits
{
    private Transport $transport;

    public function __construct(Transport $transport)
    {
        $this->transport = $transport;
    }

    public function get(): array
    {
        $result = $this->transport->get('/limits');
        return array_merge($result['data'], ['rate_limit' => $result['rate_limit']]);
    }
}

/**
 * Validate Resource
 */
class Validate
{
    private Transport $transport;

    public function __construct(Transport $transport)
    {
        $this->transport = $transport;
    }

    public function validate(int $fileSize, string $format, int $width, int $height): array
    {
        $result = $this->transport->post('/validate', [
            'json' => [
                'fileSize' => $fileSize,
                'format' => $format,
                'width' => $width,
                'height' => $height,
            ],
        ]);

        return array_merge($result['data'], ['rate_limit' => $result['rate_limit']]);
    }
}
