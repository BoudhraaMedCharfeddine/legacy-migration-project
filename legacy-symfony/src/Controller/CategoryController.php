<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $categories = $entityManager->getRepository(Category::class)->findAll();
        return $this->json($categories);
    }

    #[Route('/api/categories', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $category = new Category();
        $category->setName($data['name']);
        $category->setDescription($data['description'] ?? null);
        $entityManager->persist($category);
        $entityManager->flush();
        return $this->json($category, 201);
    }

    #[Route('/api/categories/{id}', methods: ['GET'])]
    public function show(Category $category): JsonResponse
    {
        return $this->json($category);
    }

    #[Route('/api/categories/{id}', methods: ['PUT'])]
    public function update(Request $request, Category $category, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $category->setName($data['name']);
        $category->setDescription($data['description'] ?? null);
        $entityManager->flush();
        return $this->json($category);
    }

    #[Route('/api/categories/{id}', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($category);
        $entityManager->flush();
        return $this->json(null, 204);
    }
}