import { Request, Response } from "express";
import { DynamoCustomerRepository } from "../../infrastructure/repositories/dynamoCustomerRepository";
import { CustomerUseCase } from "../../application/usecases/customerUseCase";

const repository = new DynamoCustomerRepository();
const useCase = new CustomerUseCase(repository);

export class CustomerController {
    static async saveCustomer(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        try {
            await useCase.saveCustomer(subdomain, req.body);
            res.status(201).json({ message: "Customer created successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getCustomers(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        const customers = await useCase.getCustomers(subdomain);
        res.status(200).json(customers);
    }
}
