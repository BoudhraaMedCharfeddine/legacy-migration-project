<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    #[Route('/api/orders', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $orders = $entityManager->getRepository(Order::class)->findAll();
        return $this->json($orders);
    }

    #[Route('/api/orders', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $order = new Order();
        if (isset($data['user_id'])) {
            $user = $entityManager->getRepository(User::class)->find($data['user_id']);
            $order->setUser($user);
        }
        $order->setTotal($data['total']);
        $order->setStatus($data['status'] ?? 'pending');
        $entityManager->persist($order);
        $entityManager->flush();
        return $this->json($order, 201);
    }

    #[Route('/api/orders/{id}', methods: ['GET'])]
    public function show(Order $order): JsonResponse
    {
        return $this->json($order);
    }

    #[Route('/api/orders/{id}', methods: ['PUT'])]
    public function update(Request $request, Order $order, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $order->setTotal($data['total']);
        $order->setStatus($data['status']);
        $entityManager->flush();
        return $this->json($order);
    }

    #[Route('/api/orders/{id}', methods: ['DELETE'])]
    public function delete(Order $order, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($order);
        $entityManager->flush();
        return $this->json(null, 204);
    }
}