<?php
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$question = $input["question"] ?? "Hello";

$apiKey = "YOUR_OPENAI_API_KEY_HERE"; // <--- put your real key here

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);

$data = [
    "model" => "gpt-4o-mini", // lightweight, fast model
    "messages" => [
        ["role" => "system", "content" => "You are an AI assistant inside a terminal website."],
        ["role" => "user", "content" => $question]
    ]
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$answer = $result["choices"][0]["message"]["content"] ?? "Error: No response from AI.";

echo json_encode(["answer" => $answer]);
