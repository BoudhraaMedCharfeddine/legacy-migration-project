<?php

namespace App\Controller;

use App\Entity\Payment;
use App\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    #[Route('/api/payments', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $payments = $entityManager->getRepository(Payment::class)->findAll();
        return $this->json($payments);
    }

    #[Route('/api/payments', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $payment = new Payment();
        if (isset($data['order_id'])) {
            $order = $entityManager->getRepository(Order::class)->find($data['order_id']);
            $payment->setOrder($order);
        }
        $payment->setAmount($data['amount']);
        $payment->setMethod($data['method']);
        $payment->setStatus($data['status'] ?? 'pending');
        $entityManager->persist($payment);
        $entityManager->flush();
        return $this->json($payment, 201);
    }

    #[Route('/api/payments/{id}', methods: ['GET'])]
    public function show(Payment $payment): JsonResponse
    {
        return $this->json($payment);
    }

    #[Route('/api/payments/{id}', methods: ['PUT'])]
    public function update(Request $request, Payment $payment, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $payment->setAmount($data['amount']);
        $payment->setMethod($data['method']);
        $payment->setStatus($data['status']);
        $entityManager->flush();
        return $this->json($payment);
    }

    #[Route('/api/payments/{id}', methods: ['DELETE'])]
    public function delete(Payment $payment, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($payment);
        $entityManager->flush();
        return $this->json(null, 204);
    }
}