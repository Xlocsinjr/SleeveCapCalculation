import math as m
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

dWvl = 0.1
d_small_wvl = 0.001

def Main():
    # ----------------------------------------------------------------------------------------------------------
    # Calculating the relation between armhole circumference and the corresponding sleeve cap width (wavelength).

    angle_list = []
    slope_list = []

    for angle_deg in np.arange(5, 91, 5):
        angle_list.append(angle_deg)

        points_count = 0
        sum_to_avg = 0
        lastFound = 0.001

        wvlList = []
        circList = []

        for circumference in np.arange(1, 100, 1):
            circList.append(circumference)

            amplitude, wavelength = calc_width_from_circumference(circumference, angle_deg, lastFound)
            lastFound = wavelength

            wvlList.append(wavelength)

            sum_to_avg += wavelength / circumference
            points_count += 1

        # It's a line !!!!
        # params = curve_fit(line, circList, wvlList)
        # slope = params[0]

        # print(f"slope by fit = {slope}")
        # The slope is 0.87054189 by fit
        slope_by_avg = sum_to_avg / points_count
        print(f"angle={angle_deg}, wvl/circ slope by average = {slope_by_avg}")
        # The slope is 0.8708932621568178 by average

        slope_list.append(slope_by_avg)

        # fit_xs = [1, 100]
        # fit_ys = [line(1, slope), line(100, slope)]

        # plt.plot(circList, wvlList)
        # plt.plot(fit_xs, fit_ys)
        # plt.show()

    # The result is another sinusoid!!!
    plt.plot(angle_list, slope_list)
    plt.show()

    angles_strings = [str(angle) for angle in angle_list]
    slopes_strings = [str(slope) for slope in slope_list]
    copyable_angles_line = ','.join(angles_strings)
    copyable_slopes_line = ','.join(slopes_strings)
    print(copyable_angles_line)
    print(copyable_slopes_line)

    # ----------------------------------------------------------------------------------------------------------

    #results from top section:
    angle_list = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90]
    slope_list = [0.7305331600344677,0.7372325953899461,0.7481115328846084,0.7626952955856432,0.780466921217172,0.800772787435155,0.8228908724455176,0.8460458195157209,0.8696228631052879,0.8928504145704842,0.9150342575770536,0.935612226130279,0.9540062671685976,0.9697420201028055,0.9824035703611008,0.9916754473968024,0.9973304577956911,0.9992383557800267]

    # TODO: Investigate the relation between sleeve angle and wavelength/circumference slopes.
    sine_list = []
    sine_amp = (slope_list[-1] - slope_list[0] ) / 2
    sine_base = slope_list[0] + sine_amp
    inv_cos_list = []

    for i in range(len(angle_list)):
        angle = deg_to_rad(angle_list[i])
        slope = slope_list[i]
        sine_list.append(sine_base + sine_amp * m.sin(angle * 2 - 0.5 * m.pi))

        inv_cos_list.append( sine_base + sine_amp * (1 - 2 * m.cos(angle)**2 ) )

        # divisor = (2 * m.pi) / m.cos(angle)
        # print(f"angle={angle_list[i]}, divided={slope / divisor}")

    # Testing the approximation:
    # For a circumference of 50.2 and an angle of 45 degrees:
    # A 45 degree angle gives a slope of:
    test_slope = sine_base + sine_amp * (1 - 2 * m.cos(deg_to_rad(45))**2 )
    test_width = test_slope * 50.2
    test_calculated = calc_width_from_circumference(50.2, 45)
    print(f"approx= {test_width}")
    print(f"calculated= {test_calculated[1]}")

    plt.plot(angle_list, slope_list)
    plt.plot(angle_list, sine_list)
    plt.plot(angle_list, inv_cos_list)
    plt.show()

# ======================================================================================

def calc_width_from_circumference(circumference, angle_deg, start_wvl=dWvl):
    D = circumference / m.pi
    #2a^2 = D^2 => a = sqrt( D^2 / 2)
    # amplitude = 1/2 * a
    # amplitude = 0.5 * m.sqrt( (D**2) / 2)
    angle = deg_to_rad(angle_deg)
    amplitude = 0.5 * D * m.cos(angle)

    # Calculate the arc lengths for different wavelengths until a given wavelength
    # is found that results in an arc length that is equal to the armhole circumference.
    end_big_wavelength = 0
    for wavelength in np.arange(start_wvl, 100, dWvl):
        arcLength = calc_arclength(amplitude, wavelength)

        # Stop at the first found arc length that stepped over the circumference,
        # and register at what wavelength it ended.
        if arcLength > circumference:
            end_big_wavelength = wavelength
            break
    
    # Loop back in smaller steps until the wavelength is found.
    for wavelength in np.arange(end_big_wavelength, start_wvl, -d_small_wvl):
        # Consider the wavelength found if the arc length stepped back over the circumference again.
        arcLength = calc_arclength(amplitude, wavelength)
        if arcLength <= circumference:
            found = True
            break
    if not found:
            wavelength = 0
    return (amplitude, wavelength)

def wave(A, wvl, x):
    return A * m.sin(((2*m.pi)/wvl) * x )

# def dydx(A, wvl, x):
#     return A * ((2*m.pi)/wvl) * m.cos(((2*m.pi)/wvl) * x)

# def arcpart(A, wvl, x):
#     return m.sqrt(1 + dydx(A, wvl, x))

def dy(A, wvl, x, dx):
    return wave(A, wvl, x + dx) - wave(A, wvl, x)

def arcpart(A, wvl, x, dx):
    return m.sqrt(dy(A, wvl, x, dx)**2 + dx**2)

# numerical solving of integral:

def calc_arclength(A, wvl):
    L = 0
    dx = wvl / 1000.0
    for x in np.arange(0.01, wvl + dx, dx):
        L += arcpart(A, wvl, x, dx)
    return L


def line(x, slope):
    return slope * x

def deg_to_rad(angle: float) -> float:
    return (angle / 360) * 2 * m.pi

if __name__ == "__main__":
    Main()