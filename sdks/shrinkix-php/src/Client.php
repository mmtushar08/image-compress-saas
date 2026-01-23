<?php

namespace Shrinkix;

use Shrinkix\Resources\Optimize;
use Shrinkix\Resources\Usage;
use Shrinkix\Resources\Limits;
use Shrinkix\Resources\Validate;

/**
 * Shrinkix Client
 * Main SDK entry point
 */
class Client
{
    private string $apiKey;
    private string $baseUrl;
    private bool $sandbox;
    private Transport $transport;

    public Optimize $optimize;
    public Usage $usage;
    public Limits $limits;
    public Validate $validate;

    public function __construct(
        string $apiKey,
        string $baseUrl = 'https://api.shrinkix.com/v1',
        bool $sandbox = false
    ) {
        if (empty($apiKey)) {
            throw new \InvalidArgumentException('API key is required');
        }

        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
        $this->sandbox = $sandbox;

        // Initialize transport
        $this->transport = new Transport($apiKey, $baseUrl, $sandbox);

        // Initialize resources
        $this->optimize = new Optimize($this->transport);
        $this->usage = new Usage($this->transport);
        $this->limits = new Limits($this->transport);
        $this->validate = new Validate($this->transport);
    }
}
