import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { customerDto, authDto } from "../dto";
import { crypto, jwt, notification } from "../utils";
import { customerServices, foodServices, orderServices } from "../services";

export const customerSignUp = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(
      customerDto.CreateCustomerInputs,
      req.body
    );
    const inputErrors = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (inputErrors.length > 0) return res.status(400).json(inputErrors);

    let { email, phone, password } = customerInputs;

    const { hash, salt } = crypto.generateHash(password);

    const { otp, otpExpiry } = await crypto.generateOtp();

    const customer = await customerServices.saveCustomer({
      email,
      phone,
      password: hash,
      salt,
      otp,
      otpExpiry,
      verified: false,
    });

    if (!customer) return res.status(400).json({ message: "Bad Request" });

    await notification.sendOtp(otp, phone);
    const tokens = await jwt.generateTokens({
      _id: customer._id,
      email: customer.email,
      verified: customer.verified,
    });
    return res
      .status(201)
      .json({ message: "Customer Successfully Registered", tokens });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const customerLogin = async (req: Request, res: Response) => {
  try {
    const customerLoginInputs = plainToClass(
      customerDto.CustomerLoginInputs,
      req.body
    );

    const inputErrors = await validate(customerLoginInputs, {
      validationError: { target: true },
    });

    if (inputErrors.length > 0) return res.status(400).json(inputErrors);

    const { email, password } = customerLoginInputs;

    const customer = await customerServices.findCustomerByEmail(email);

    if (!customer)
      return res
        .status(404)
        .json({ message: "Customer With Email Is Not Registered" });

    if (!customer.verified)
      return res.status(400).json({ message: "Customer Is Not Verified" });

    const isPasswordValid = await crypto.isHashValid(
      password,
      customer.salt,
      customer.password
    );

    if (!isPasswordValid)
      return res.status(400).json({ message: "Password Mismatch" });

    const tokens = jwt.generateTokens({
      _id: customer._id,
      email: customer.email,
    });

    return res.status(200).json({
      message: "Customer  Logged In Successfully",
      vendor: { customerId: customer._id, email: customer.email },
      tokens,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const customerProfileView = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const customer = req.user;

    if (customer) {
      const profile = await customerServices.findCustomerById(customer._id);

      if (profile) {
        res.status(200).json({
          message: "Customer Profile Retrieved Successfully",
          customer: profile,
        });
      }
      res.status(400).json({ message: "Customer Information Not Found" });
    }
    res.status(400).json({ message: "Unauthorized User" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const customerProfileUpdate = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const customer = req.body;

    const customerUpdateInputs = plainToClass(
      customerDto.CustomerUpdateInputs,
      req.body
    );

    const inputErrors = await validate(customerUpdateInputs, {
      validationError: { target: true },
    });

    if (inputErrors.length > 0) return res.status(400).json(inputErrors);

    const { firstName, lastName, address } = customerUpdateInputs;

    const updatedCustomer = await customerServices.updateCustomer(
      customer._id,
      { firstName, lastName, address }
    );
    res.status(200).json({
      message: "Customer Profile Updated Successfully",
      customer: updatedCustomer,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOtp = async (req: authDto.CustomAuthRequest, res: Response) => {
  try {
    const customer = req.user;

    if (customer) {
      const profile = await customerServices.findCustomerById(customer._id);
      const { otp, otpExpiry } = await crypto.generateOtp();

      if (profile) {
        profile.otp = otp;
        profile.otpExpiry = otpExpiry;
        await profile.save();
        await notification.sendOtp(otp, profile.phone);

        res.status(200).json({ message: "OTP Sent To Your Registered Number" });
      }
      res.status(400).json({ message: "Customer Information Not Found" });
    }
    res.status(400).json({ message: "Unauthorized User" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const verifyCustomer = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const { otp } = req.body;
    const customer = req.user;

    if (!customer)
      return res.status(404).json({ message: "Customer Not Found" });

    const profile = await customerServices.findCustomerById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otpExpiry >= new Date()) {
        profile.verified = true;
        const updatedCustomer = await profile.save();
        const tokens = jwt.generateTokens({
          _id: updatedCustomer._id,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
        });
        return res.status(200).json({
          message: "Customer Successfully Verified",
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
          tokens,
        });
      }
      return res.status(400).json({ message: "Invalid / Expired Otp" });
    }

    res.status(400).json({ message: "Customer Information Not Found" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const createOrder = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const customer = req.user;

    if (customer) {
      const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
      const profile = await customerServices.findCustomerById(customer._id);
      const cart = <[customerDto.OrderInputs]>req.body;
      let cartItems = Array();
      let netAmount = 0.0;

      const foods = await foodServices.findFoodsById(cart);

      foods.map((food: any) => {
        cart.map(({ _id, unit }) => {
          if (food._id == _id) {
            netAmount += food.price * +unit;
            cartItems.push({ food: food._id, unit });
          }
        });
      });

      if (cartItems) {
        const order = {
          orderId,
          items: cartItems,
          totalAmount: netAmount,
          orderDate: new Date(),
          paymentMethod: "COD",
          paymentResponse: false,
          orderStatus: "Waiting",
        };
        const currentOrder = await orderServices.saveOrder(order);

        if (currentOrder && profile) {
          profile.orders.push(currentOrder);
          await profile.save();

          return res.status(200).json({
            message: "Order Successfully Created",
            currentOrder,
          });
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrders = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const customer = req.user;

    if (customer) {
      const profile = await customerServices.findOrdersByCustomerId(
        customer._id
      );
      if (profile)
        return res
          .status(200)
          .json({ message: "Orders Retrieved Successfully" });
      return res.status(200).json({ message: "Customer Not Found" });
    }
    return res.status(200).json({ message: "Unauthorized User" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrderById = async (
  req: authDto.CustomAuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (id) {
      const order = await orderServices.findOrderById(id);
      return res
        .status(200)
        .json({ message: "Order Retrieved Successfully", order });
    }
    return res.status(404).json({ message: "Order Not Found" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
