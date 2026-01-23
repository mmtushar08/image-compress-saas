<?php

namespace Shrinkix;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use Shrinkix\Errors\ApiException;
use Shrinkix\Errors\NetworkException;

/**
 * HTTP Transport Layer
 */
class Transport
{
    private string $apiKey;
    private string $baseUrl;
    private bool $sandbox;
    private GuzzleClient $client;

    public function __construct(string $apiKey, string $baseUrl = 'https://api.shrinkix.com/v1', bool $sandbox = false)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
        $this->sandbox = $sandbox;

        $headers = [
            'Authorization' => "Bearer {$apiKey}",
            'User-Agent' => 'shrinkix-php/1.0.0',
        ];

        if ($sandbox) {
            $headers['X-Mode'] = 'sandbox';
        }

        $this->client = new GuzzleClient([
            'base_uri' => $baseUrl,
            'headers' => $headers,
        ]);
    }

    public function get(string $endpoint, array $params = []): array
    {
        return $this->request('GET', $endpoint, ['query' => $params]);
    }

    public function post(string $endpoint, array $options = []): array
    {
        return $this->request('POST', $endpoint, $options);
    }

    private function request(string $method, string $endpoint, array $options = []): array
    {
        try {
            $response = $this->client->request($method, $endpoint, $options);

            // Extract rate limit headers
            $rateLimit = [
                'limit' => $response->getHeaderLine('x-ratelimit-limit'),
                'remaining' => $response->getHeaderLine('x-ratelimit-remaining'),
                'reset' => $response->getHeaderLine('x-ratelimit-reset'),
                'request_id' => $response->getHeaderLine('x-request-id'),
            ];

            $body = json_decode($response->getBody()->getContents(), true);

            return [
                'data' => $body,
                'rate_limit' => $rateLimit,
                'headers' => $response->getHeaders(),
            ];

        } catch (GuzzleException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
                $body = json_decode($response->getBody()->getContents(), true);

                $rateLimit = [
                    'limit' => $response->getHeaderLine('x-ratelimit-limit'),
                    'remaining' => $response->getHeaderLine('x-ratelimit-remaining'),
                    'reset' => $response->getHeaderLine('x-ratelimit-reset'),
                    'request_id' => $response->getHeaderLine('x-request-id'),
                ];

                throw new ApiException(
                    $body['message'] ?? 'API Error',
                    $body['error'] ?? 'UNKNOWN_ERROR',
                    $response->getStatusCode(),
                    $body['request_id'] ?? null,
                    $body['details'] ?? [],
                    $body['docs_url'] ?? null,
                    $rateLimit,
                    $response->getHeaderLine('retry-after') ?: null
                );
            }

            throw new NetworkException('Network request failed', $e);
        }
    }
}
